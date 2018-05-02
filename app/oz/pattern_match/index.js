import { patternTypes } from "../machine/patterns";
import identifier from "./pattern/identifier";
import number from "./pattern/number";
import record from "./pattern/record";

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
