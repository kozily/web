import Immutable from "immutable";
import {
  buildSigma,
  buildEquivalenceClass,
  buildVariable,
  buildEnvironment,
} from "../../app/oz/machine/build";
import { valueRecord, valueBuiltIn } from "../../app/oz/machine/values";
import { initialize } from "../../app/oz/machine/initialization";

describe("Validates initialization", () => {
  beforeEach(() => {
    jasmine.addCustomEqualityTester(Immutable.is);
  });

  describe("Builtins must exists in environment and in sigma", () => {
    it("all builtins must be generated", () => {
      const environment = buildEnvironment({
        Number: buildVariable("number", 0),
        Float: buildVariable("float", 0),
        Value: buildVariable("value", 0),
      });
      const sigma = buildSigma(
        buildEquivalenceClass(
          valueBuiltIn("+", "Number"),
          buildVariable("numberaddition", 0),
        ),
        buildEquivalenceClass(
          valueBuiltIn("-", "Number"),
          buildVariable("numbersubtraction", 0),
        ),
        buildEquivalenceClass(
          valueBuiltIn("*", "Number"),
          buildVariable("numbermultiplication", 0),
        ),
        buildEquivalenceClass(
          valueBuiltIn("/", "Number"),
          buildVariable("numberdivision", 0),
        ),
        buildEquivalenceClass(
          valueBuiltIn("/", "Float"),
          buildVariable("floatdivision", 0),
        ),
        buildEquivalenceClass(
          valueBuiltIn("==", "Value"),
          buildVariable("valueequality", 0),
        ),
        buildEquivalenceClass(
          valueBuiltIn("\\=", "Value"),
          buildVariable("valuenonequality", 0),
        ),
        buildEquivalenceClass(
          valueBuiltIn("=<", "Value"),
          buildVariable("valuelessthanorequal", 0),
        ),
        buildEquivalenceClass(
          valueBuiltIn("<", "Value"),
          buildVariable("valuelessthan", 0),
        ),
        buildEquivalenceClass(
          valueBuiltIn(">=", "Value"),
          buildVariable("valuegreaterthanorequal", 0),
        ),
        buildEquivalenceClass(
          valueBuiltIn(">", "Value"),
          buildVariable("valuegreaterthan", 0),
        ),
        buildEquivalenceClass(
          valueRecord("Number", {
            "+": buildVariable("numberaddition", 0),
            "-": buildVariable("numbersubtraction", 0),
            "*": buildVariable("numbermultiplication", 0),
            "/": buildVariable("numberdivision", 0),
          }),
          buildVariable("number", 0),
        ),
        buildEquivalenceClass(
          valueRecord("Float", {
            "/": buildVariable("floatdivision", 0),
          }),
          buildVariable("float", 0),
        ),
        buildEquivalenceClass(
          valueRecord("Value", {
            "==": buildVariable("valueequality", 0),
            "\\=": buildVariable("valuenonequality", 0),
            "=<": buildVariable("valuelessthanorequal", 0),
            "<": buildVariable("valuelessthan", 0),
            ">=": buildVariable("valuegreaterthanorequal", 0),
            ">": buildVariable("valuegreaterthan", 0),
          }),
          buildVariable("value", 0),
        ),
      );

      expect(initialize()).toEqual(Immutable.fromJS({ environment, sigma }));
    });
  });
});
