import Immutable from "immutable";
import parser from "../app/oz/parser";
import kernelizer from "../app/oz/kernelizer";
import { buildFromKernelAST } from "../app/oz/machine/build";
import { executeAllSteps } from "../app/oz/runtime";

describe("Running a simple program", () => {
  beforeEach(() => {
    jasmine.addCustomEqualityTester(Immutable.is);
  });

  it("parses, compiles and runs", () => {
    const tree = parser("skip");
    const kernel = kernelizer(tree);
    const runtime = buildFromKernelAST(kernel);

    expect(() => executeAllSteps(runtime)).not.toThrowError();
  });
});
