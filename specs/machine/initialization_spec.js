import Immutable from "immutable";
import { skipStatement } from "../../app/oz/machine/statements";
import {
  buildFromKernelAST,
  buildVariable,
  buildEnvironment,
} from "../../app/oz/machine/build";
import { lookupVariableInSigma } from "../../app/oz/machine/sigma";
import { valueRecord, valueBuiltIn } from "../../app/oz/machine/values";

const lookupBuiltInInSigma = (sigma, builtIn) =>
  lookupVariableInSigma(sigma, buildVariable(builtIn, 0)).get("value");

describe("State initialization", () => {
  beforeEach(() => {
    jasmine.addCustomEqualityTester(Immutable.is);
  });

  it("must generate the appropriate environment ", () => {
    const state = buildFromKernelAST(skipStatement());

    const environment = buildEnvironment({
      Number: buildVariable("number", 0),
      Float: buildVariable("float", 0),
      Record: buildVariable("record", 0),
    });

    expect(state.getIn(["threads", 0, "stack", 0, "environment"])).toEqual(
      environment,
    );
  });

  it("must generate the appropiate sigma", () => {
    const state = buildFromKernelAST(skipStatement());
    const sigma = state.get("sigma");

    expect(lookupBuiltInInSigma(sigma, "number")).toEqual(
      valueRecord("Number", {
        "+": buildVariable("numberaddition", 0),
        "-": buildVariable("numbersubtraction", 0),
        "*": buildVariable("numbermultiplication", 0),
        div: buildVariable("numberdivision", 0),
        mod: buildVariable("numbermodulo", 0),
      }),
    );
    expect(lookupBuiltInInSigma(sigma, "numberaddition")).toEqual(
      valueBuiltIn("+", "Number"),
    );
    expect(lookupBuiltInInSigma(sigma, "numbersubtraction")).toEqual(
      valueBuiltIn("-", "Number"),
    );
    expect(lookupBuiltInInSigma(sigma, "numbermultiplication")).toEqual(
      valueBuiltIn("*", "Number"),
    );
    expect(lookupBuiltInInSigma(sigma, "numberdivision")).toEqual(
      valueBuiltIn("div", "Number"),
    );
    expect(lookupBuiltInInSigma(sigma, "numbermodulo")).toEqual(
      valueBuiltIn("mod", "Number"),
    );

    expect(lookupBuiltInInSigma(sigma, "float")).toEqual(
      valueRecord("Float", {
        "/": buildVariable("floatdivision", 0),
      }),
    );
    expect(lookupBuiltInInSigma(sigma, "floatdivision")).toEqual(
      valueBuiltIn("/", "Float"),
    );

    expect(lookupBuiltInInSigma(sigma, "record")).toEqual(
      valueRecord("Record", {
        ".": buildVariable("recordfeatureselection", 0),
      }),
    );
    expect(lookupBuiltInInSigma(sigma, "recordfeatureselection")).toEqual(
      valueBuiltIn(".", "Record"),
    );
  });
});
