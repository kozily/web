import { patternTypes } from "../machine/patterns";
import identifier from "./identifier";
import number from "./number";
import record from "./record";

export const matchers = {
  [patternTypes.identifier]: identifier,
  [patternTypes.number]: number,
  [patternTypes.record]: record,
};

export const patternMatch = (evaluation, pattern, sigma) => {
  const matcher =
    pattern.get("node") !== "literal"
      ? matchers[patternTypes.identifier]
      : matchers[pattern.get("type")];

  return matcher(patternMatch, evaluation, pattern, sigma);
};
