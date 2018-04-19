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
        "+": buildVariable("nsum", 0),
        "-": buildVariable("nsub", 0),
        "*": buildVariable("nmul", 0),
        div: buildVariable("ndiv", 0),
        mod: buildVariable("nmod", 0),
      }),
    );
    expect(lookupBuiltInInSigma(sigma, "nsum")).toEqual(
      valueBuiltIn("+", "Number"),
    );
    expect(lookupBuiltInInSigma(sigma, "nsub")).toEqual(
      valueBuiltIn("-", "Number"),
    );
    expect(lookupBuiltInInSigma(sigma, "nmul")).toEqual(
      valueBuiltIn("*", "Number"),
    );
    expect(lookupBuiltInInSigma(sigma, "ndiv")).toEqual(
      valueBuiltIn("div", "Number"),
    );
    expect(lookupBuiltInInSigma(sigma, "nmod")).toEqual(
      valueBuiltIn("mod", "Number"),
    );

    expect(lookupBuiltInInSigma(sigma, "float")).toEqual(
      valueRecord("Float", {
        "/": buildVariable("fdiv", 0),
      }),
    );
    expect(lookupBuiltInInSigma(sigma, "fdiv")).toEqual(
      valueBuiltIn("/", "Float"),
    );

    expect(lookupBuiltInInSigma(sigma, "record")).toEqual(
      valueRecord("Record", {
        ".": buildVariable("rsel", 0),
      }),
    );
    expect(lookupBuiltInInSigma(sigma, "rsel")).toEqual(
      valueBuiltIn(".", "Record"),
    );
  });
});
