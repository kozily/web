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

  describe("Number must exists in environment and in sigma", () => {
    it("numberplus must be generated", () => {
      const environment = buildEnvironment({
        Number: buildVariable("number", 0),
      });
      const sigma = buildSigma(
        buildEquivalenceClass(
          valueBuiltIn("+", "Number"),
          buildVariable("numberplus", 0),
        ),
        buildEquivalenceClass(
          valueBuiltIn("-", "Number"),
          buildVariable("numberminus", 0),
        ),
        buildEquivalenceClass(
          valueBuiltIn("*", "Number"),
          buildVariable("numbermultiplication", 0),
        ),
        buildEquivalenceClass(
          valueRecord("Number", {
            "+": buildVariable("numberplus", 0),
            "-": buildVariable("numberminus", 0),
            "*": buildVariable("numbermultiplication", 0),
          }),
          buildVariable("number", 0),
        ),
      );

      expect(initialize()).toEqual(Immutable.fromJS({ environment, sigma }));
    });
  });
});
