import { valueMutableVariable } from "./values";

export const makeNewMutableVariable = ({ in: mu, for: kind }) => {
  const currentMaximumVariable = mu
    .map(mapping => mapping.get("mutableVariable"))
    .filter(variable => variable.get("kind") === kind)
    .maxBy(variable => variable.get("sequence"));

  if (currentMaximumVariable === undefined) {
    return valueMutableVariable(kind, 0);
  }

  return valueMutableVariable(kind, currentMaximumVariable + 1);
};
