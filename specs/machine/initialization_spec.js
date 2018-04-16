import Immutable from "immutable";
import { skipStatement } from "../../app/oz/machine/statements";
import {
  buildFromKernelAST,
  buildSigma,
  buildEquivalenceClass,
  buildVariable,
  buildEnvironment,
} from "../../app/oz/machine/build";
import { valueRecord, valueBuiltIn } from "../../app/oz/machine/values";

describe("State initialization", () => {
  beforeEach(() => {
    jasmine.addCustomEqualityTester(Immutable.is);
  });

  it("must generate the appropriate environment ", () => {
    const state = buildFromKernelAST(skipStatement());

    const environment = buildEnvironment({
      Number: buildVariable("number", 0),
      Float: buildVariable("float", 0),
    });

    expect(state.getIn(["threads", 0, "stack", 0, "environment"])).toEqual(
      environment,
    );
  });

  it("must generate the appropiate sigma", () => {
    const state = buildFromKernelAST(skipStatement());

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
        valueBuiltIn("div", "Number"),
        buildVariable("numberdivision", 0),
      ),
      buildEquivalenceClass(
        valueBuiltIn("mod", "Number"),
        buildVariable("numbermodulo", 0),
      ),
      buildEquivalenceClass(
        valueBuiltIn("/", "Float"),
        buildVariable("floatdivision", 0),
      ),
      buildEquivalenceClass(
        valueRecord("Number", {
          "+": buildVariable("numberaddition", 0),
          "-": buildVariable("numbersubtraction", 0),
          "*": buildVariable("numbermultiplication", 0),
          div: buildVariable("numberdivision", 0),
          mod: buildVariable("numbermodulo", 0),
        }),
        buildVariable("number", 0),
      ),
      buildEquivalenceClass(
        valueRecord("Float", {
          "/": buildVariable("floatdivision", 0),
        }),
        buildVariable("float", 0),
      ),
    );

    expect(state.get("sigma")).toEqual(sigma);
  });
});
