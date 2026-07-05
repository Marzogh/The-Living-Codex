function mapById(items = []) {
  return new Map(items.map((item) => [item.id, item]));
}

export function validateHelpModel({ sections = [], glossary = {}, registry = [], actionMap = {} } = {}) {
  const errors = [];
  const sectionMap = mapById(sections);
  const glossaryIds = new Set(Object.keys(glossary || {}));
  const actionIds = new Set(Object.keys(actionMap || {}));
  const sectionIds = sections.map((section) => section.id).filter(Boolean);
  const uniqueIds = new Set(sectionIds);

  if (uniqueIds.size !== sectionIds.length) {
    errors.push("Help sections must have unique ids.");
  }

  for (const section of sections) {
    if (!section?.id) errors.push("Every help section must define an id.");
    if (!section?.title) errors.push(`Help section '${section?.id || "unknown"}' is missing a title.`);
    if (!section?.navLabel) errors.push(`Help section '${section?.id || "unknown"}' is missing a navLabel.`);
    for (const relatedId of section?.related || []) {
      if (!sectionMap.has(relatedId)) {
        errors.push(`Help section '${section.id}' references missing related section '${relatedId}'.`);
      }
    }
    for (const block of section?.blocks || []) {
      if (block?.type === "term_definition") {
        for (const termId of block.termIds || []) {
          if (!glossaryIds.has(termId)) {
            errors.push(`Help section '${section.id}' references missing glossary term '${termId}'.`);
          }
        }
      }
      if (block?.type === "action_reference") {
        for (const row of block.actions || []) {
          if (!actionIds.has(row.actionId)) {
            errors.push(`Help section '${section.id}' references missing help action '${row.actionId}'.`);
          }
        }
      }
    }
  }

  for (const row of registry) {
    if (!row?.featureId) errors.push("Every help registry entry must define featureId.");
    if (!sectionMap.has(row?.sectionId)) {
      errors.push(`Help feature '${row?.featureId || "unknown"}' maps to missing section '${row?.sectionId || "unknown"}'.`);
    }
    if (row?.actionId && !actionIds.has(row.actionId)) {
      errors.push(`Help feature '${row.featureId}' references missing action '${row.actionId}'.`);
    }
  }

  return errors;
}

export function createHelpController({
  sections = [],
  glossary = {},
  registry = [],
  actionMap = {},
  getState = () => ({})
} = {}) {
  const sectionMap = mapById(sections);
  const featureMap = new Map(registry.map((row) => [row.featureId, row]));
  const validationErrors = validateHelpModel({ sections, glossary, registry, actionMap });

  function normalizeSectionId(sectionId) {
    if (sectionId && sectionMap.has(sectionId)) return sectionId;
    return sections[0]?.id || "";
  }

  function listHelpSections() {
    return sections.slice();
  }

  function resolveHelpSection(featureId) {
    if (!featureId) return normalizeSectionId();
    const row = featureMap.get(featureId);
    if (!row) return normalizeSectionId();
    if (typeof row.visibleWhen === "function" && !row.visibleWhen(getState()?.character || getState())) {
      return normalizeSectionId();
    }
    return normalizeSectionId(row.sectionId);
  }

  function openHelp(sectionId) {
    return normalizeSectionId(sectionId);
  }

  function getHelpQuickActions(sectionId) {
    const section = sectionMap.get(normalizeSectionId(sectionId));
    if (!section) return [];
    return (section.blocks || [])
      .filter((block) => block.type === "action_reference")
      .flatMap((block) => block.actions || [])
      .map((row) => ({
        ...row,
        handler: actionMap[row.actionId] || null
      }));
  }

  function runHelpAction(actionId) {
    const handler = actionMap[actionId];
    if (typeof handler === "function") {
      return handler();
    }
    return false;
  }

  function getFeatureMeta(featureId) {
    return featureMap.get(featureId) || null;
  }

  return {
    validationErrors,
    glossary,
    openHelp,
    resolveHelpSection,
    listHelpSections,
    getHelpQuickActions,
    runHelpAction,
    getFeatureMeta
  };
}
