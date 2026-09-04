const AMMO_TYPES = new Set(["arrow", "bolt", "bullet", "cannonball", "sling_bullet", "blowgun_needle", "custom"]);

function key(value) {
  return (value ?? "").toString().trim().toLowerCase().replace(/[^a-z0-9]+/g, "");
}

export function normalizeAmmunitionType(value) {
  const normalized = (value ?? "").toString().trim().toLowerCase();
  return AMMO_TYPES.has(normalized) ? normalized : "";
}

export function inferInventoryAmmunitionType(item = {}) {
  const explicit = normalizeAmmunitionType(item.ammunition_type);
  if (explicit) return explicit;
  const name = key(item.name);
  if (/cannonballs?/.test(name)) return "cannonball";
  if (/blowgunneedles?|needles?/.test(name)) return "blowgun_needle";
  if (/sling(bullets?|stones?)/.test(name)) return "sling_bullet";
  if (/arrows?/.test(name)) return "arrow";
  if (/(crossbow)?bolts?|quarrels?/.test(name)) return "bolt";
  if (/bullets?|cartridges?|ammunition|ammo|shot/.test(name)) return "bullet";
  return item.item_type === "ammunition" ? "custom" : "";
}

export function inferWeaponAmmunitionType(attack = {}) {
  const explicit = normalizeAmmunitionType(attack.ammunition_type);
  if (explicit) return explicit;
  const name = key(`${attack.catalog_id || ""} ${attack.name || ""}`);
  if (name.includes("crossbow")) return "bolt";
  if (name.includes("blowgun")) return "blowgun_needle";
  if (name.includes("cannon")) return "cannonball";
  if (name.includes("sling")) return "sling_bullet";
  if (name.includes("bow")) return "arrow";
  if (/(pistol|musket|firearm|rifle|gun)/.test(name)) return "bullet";
  return "";
}

export function attackUsesAmmunition(attack = {}) {
  const properties = Array.isArray(attack.properties)
    ? attack.properties
    : (attack.properties || "").toString().split(",");
  return Boolean(inferWeaponAmmunitionType(attack))
    || properties.some((property) => key(property) === "ammunition");
}

export function normalizeAmmunitionLinks(value) {
  const rows = Array.isArray(value) ? value : [];
  return [...new Set(rows.map((id) => (id ?? "").toString().trim()).filter(Boolean))];
}

export function compatibleAmmunitionItems(attack = {}, inventory = []) {
  if (!attackUsesAmmunition(attack)) return [];
  const required = inferWeaponAmmunitionType(attack);
  return (Array.isArray(inventory) ? inventory : []).filter((item) => {
    if (item?.item_type === "item") return false;
    const type = inferInventoryAmmunitionType(item);
    if (!type) return false;
    if (!required || required === "custom" || type === "custom") return true;
    if (required === "sling_bullet" && type === "bullet") return true;
    return type === required;
  });
}

export function linkedAmmunitionItems(attack = {}, inventory = []) {
  const links = normalizeAmmunitionLinks(attack.ammunition_links);
  const byId = new Map((Array.isArray(inventory) ? inventory : []).map((item) => [(item?.id || "").toString(), item]));
  return links.map((id) => byId.get(id)).filter(Boolean);
}

export function consumeLinkedAmmunition(inventory = [], attack = {}, ammunitionId = "") {
  const next = (Array.isArray(inventory) ? inventory : []).map((item) => ({ ...item }));
  const links = normalizeAmmunitionLinks(attack.ammunition_links);
  const selectedId = (ammunitionId || attack.selected_ammunition_id || links[0] || "").toString();
  if (!selectedId) return { ok: true, consumed: false, inventory: next, item: null, remaining: null };
  if (!links.includes(selectedId)) return { ok: false, consumed: false, inventory: next, reason: "That ammunition is not linked to this weapon." };
  const item = next.find((row) => (row?.id || "").toString() === selectedId);
  if (!item) return { ok: false, consumed: false, inventory: next, reason: "The selected ammunition is no longer in inventory." };
  if (item.unlimited_ammunition || attack.unlimited_ammunition) {
    return { ok: true, consumed: false, inventory: next, item, remaining: null };
  }
  const quantity = Math.max(0, Number.parseInt(item.qty, 10) || 0);
  if (quantity <= 0) return { ok: false, consumed: false, inventory: next, item, remaining: 0, reason: `${item.name || "Ammunition"} is empty.` };
  item.qty = quantity - 1;
  return { ok: true, consumed: true, inventory: next, item, remaining: item.qty };
}
