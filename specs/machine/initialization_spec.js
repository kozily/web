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
  lookupVariableInSigma(sigma, buildVariable(builtIn, 0, { system: true })).get(
    "value",
  );

describe("State initialization", () => {
  beforeEach(() => {
    jasmine.addCustomEqualityTester(Immutable.is);
  });

  it("must generate the appropriate environment ", () => {
    const state = buildFromKernelAST(skipStatement());

    const environment = buildEnvironment({
      Number: buildVariable("number", 0, { system: true }),
      Float: buildVariable("float", 0, { system: true }),
      Record: buildVariable("record", 0, { system: true }),
      Value: buildVariable("value", 0, { system: true }),
    });

    expect(state.getIn(["threads", 0, "stack", 0, "environment"])).toEqual(
      environment,
    );
  });

  it("must generate the appropiate sigma entries for the number built-ins", () => {
    const state = buildFromKernelAST(skipStatement());
    const sigma = state.get("sigma");

    expect(lookupBuiltInInSigma(sigma, "number")).toEqual(
      valueRecord("Number", {
        "+": buildVariable("nsum", 0, { system: true }),
        "-": buildVariable("nsub", 0, { system: true }),
        "*": buildVariable("nmul", 0, { system: true }),
        div: buildVariable("ndiv", 0, { system: true }),
        mod: buildVariable("nmod", 0, { system: true }),
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
  });

  it("must generate the appropiate sigma entries for the float built-ins", () => {
    const state = buildFromKernelAST(skipStatement());
    const sigma = state.get("sigma");

    expect(lookupBuiltInInSigma(sigma, "float")).toEqual(
      valueRecord("Float", {
        "/": buildVariable("fdiv", 0, { system: true }),
      }),
    );
    expect(lookupBuiltInInSigma(sigma, "fdiv")).toEqual(
      valueBuiltIn("/", "Float"),
    );
  });

  it("must generate the appropiate sigma entries for the record built-ins", () => {
    const state = buildFromKernelAST(skipStatement());
    const sigma = state.get("sigma");

    expect(lookupBuiltInInSigma(sigma, "record")).toEqual(
      valueRecord("Record", {
        ".": buildVariable("rsel", 0, { system: true }),
      }),
    );
    expect(lookupBuiltInInSigma(sigma, "rsel")).toEqual(
      valueBuiltIn(".", "Record"),
    );
  });

  it("must generate the appropiate sigma entries for the value built-ins", () => {
    const state = buildFromKernelAST(skipStatement());
    const sigma = state.get("sigma");

    expect(lookupBuiltInInSigma(sigma, "value")).toEqual(
      valueRecord("Value", {
        "==": buildVariable("veq", 0, { system: true }),
        "\\=": buildVariable("vneq", 0, { system: true }),
        "<": buildVariable("vlt", 0, { system: true }),
        "<=": buildVariable("vle", 0, { system: true }),
        ">": buildVariable("vgt", 0, { system: true }),
        ">=": buildVariable("vge", 0, { system: true }),
      }),
    );
    expect(lookupBuiltInInSigma(sigma, "veq")).toEqual(
      valueBuiltIn("==", "Value"),
    );
    expect(lookupBuiltInInSigma(sigma, "vneq")).toEqual(
      valueBuiltIn("\\=", "Value"),
    );
    expect(lookupBuiltInInSigma(sigma, "vlt")).toEqual(
      valueBuiltIn("<", "Value"),
    );
    expect(lookupBuiltInInSigma(sigma, "vle")).toEqual(
      valueBuiltIn("<=", "Value"),
    );
    expect(lookupBuiltInInSigma(sigma, "vgt")).toEqual(
      valueBuiltIn(">", "Value"),
    );
    expect(lookupBuiltInInSigma(sigma, "vge")).toEqual(
      valueBuiltIn(">=", "Value"),
    );
  });
});
