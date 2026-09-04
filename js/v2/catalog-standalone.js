import classes2014 from "../../data/dnd5e_2014/classes.min.json";
import subclasses2014 from "../../data/dnd5e_2014/subclasses.min.json";
import species2014 from "../../data/dnd5e_2014/species.min.json";
import spells2014 from "../../data/dnd5e_2014/spells.min.json";
import attacks2014 from "../../data/dnd5e_2014/attacks.min.json";
import companions2014 from "../../data/dnd5e_2014/companions.min.json";
import features2014 from "../../data/dnd5e_2014/features.min.json";
import classes2024 from "../../data/dnd5e_2014/classes.min.json";
import subclasses2024 from "../../data/dnd5e_2014/subclasses.min.json";
import species2024 from "../../data/dnd5e_2014/species.min.json";
import spells2024 from "../../data/dnd5e_2014/spells.min.json";
import attacks2024 from "../../data/dnd5e_2014/attacks.min.json";
import companions2024 from "../../data/dnd5e_2014/companions.min.json";
import features2024 from "../../data/dnd5e_2014/features.min.json";

function asList(v) {
  return Array.isArray(v) ? v : [];
}

export const STANDALONE_CATALOG = {
  dnd5e_2014: {
    rulesetId: "dnd5e_2014",
    classes: asList(classes2014),
    subclasses: asList(subclasses2014),
    species: asList(species2014),
    spells: asList(spells2014),
    attacks: asList(attacks2014),
    companions: asList(companions2014),
    features: asList(features2014)
  },
  dnd5e_2024: {
    rulesetId: "dnd5e_2024",
    classes: asList(classes2024),
    subclasses: asList(subclasses2024),
    species: asList(species2024),
    spells: asList(spells2024),
    attacks: asList(attacks2024),
    companions: asList(companions2024),
    features: asList(features2024)
  }
};
