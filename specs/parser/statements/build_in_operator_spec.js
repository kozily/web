import Immutable from "immutable";
import { lexicalVariable } from "../../samples/lexical";
import { buildInOperatorStatement } from "../../samples/statements";
import parse from "../../../app/oz/parser";

describe("Parsing build-in operator statements", () => {
  beforeEach(() => {
    jasmine.addCustomEqualityTester(Immutable.is);
  });

  it("make two variables of type Value apply equal operation and then an asignation", () => {
    expect(parse("{Value.`==` X Y Z}")).toEqual(
      buildInOperatorStatement("Value", "==", [
        lexicalVariable("X"),
        lexicalVariable("Y"),
        lexicalVariable("Z"),
      ]),
    );
  });

  it("make two variables of type Value apply assignate operation and then an asignation", () => {
    expect(parse("{Value.`\\=` X Y Z}")).toEqual(
      buildInOperatorStatement("Value", "\\=", [
        lexicalVariable("X"),
        lexicalVariable("Y"),
        lexicalVariable("Z"),
      ]),
    );
  });

  it("make two variables of type Value apply less than operation and then an asignation", () => {
    expect(parse("{Value.`=<` X Y Z}")).toEqual(
      buildInOperatorStatement("Value", "=<", [
        lexicalVariable("X"),
        lexicalVariable("Y"),
        lexicalVariable("Z"),
      ]),
    );
  });

  it("make two variables of type Value apply less operation and then an asignation", () => {
    expect(parse("{Value.`<` X Y Z}")).toEqual(
      buildInOperatorStatement("Value", "<", [
        lexicalVariable("X"),
        lexicalVariable("Y"),
        lexicalVariable("Z"),
      ]),
    );
  });

  it("make two variables of type Value apply greater operation and then an asignation", () => {
    expect(parse("{Value.`>` X Y Z}")).toEqual(
      buildInOperatorStatement("Value", ">", [
        lexicalVariable("X"),
        lexicalVariable("Y"),
        lexicalVariable("Z"),
      ]),
    );
  });

  it("make two variables of type Value apply greater than operation and then an asignation", () => {
    expect(parse("{Value.`>=` X Y Z}")).toEqual(
      buildInOperatorStatement("Value", ">=", [
        lexicalVariable("X"),
        lexicalVariable("Y"),
        lexicalVariable("Z"),
      ]),
    );
  });

  it("make two variables of type Number apply plus operation and then an asignation", () => {
    expect(parse("{Number.`+` X Y Z}")).toEqual(
      buildInOperatorStatement("Number", "+", [
        lexicalVariable("X"),
        lexicalVariable("Y"),
        lexicalVariable("Z"),
      ]),
    );
  });

  it("make two variables of type Number apply substraction operation and then an asignation", () => {
    expect(parse("{Number.`-` X Y Z}")).toEqual(
      buildInOperatorStatement("Number", "-", [
        lexicalVariable("X"),
        lexicalVariable("Y"),
        lexicalVariable("Z"),
      ]),
    );
  });

  it("make two variables of type Number apply multiplicate operation and then an asignation", () => {
    expect(parse("{Number.`*` X Y Z}")).toEqual(
      buildInOperatorStatement("Number", "*", [
        lexicalVariable("X"),
        lexicalVariable("Y"),
        lexicalVariable("Z"),
      ]),
    );
  });

  it("make two variables of type Number apply division operation and then an asignation", () => {
    expect(parse("{Number.`div` X Y Z}")).toEqual(
      buildInOperatorStatement("Number", "div", [
        lexicalVariable("X"),
        lexicalVariable("Y"),
        lexicalVariable("Z"),
      ]),
    );
  });

  it("make two variables of type Number apply modular operation and then an asignation", () => {
    expect(parse("{Number.`mod` X Y Z}")).toEqual(
      buildInOperatorStatement("Number", "mod", [
        lexicalVariable("X"),
        lexicalVariable("Y"),
        lexicalVariable("Z"),
      ]),
    );
  });

  it("make two variables of type Float apply division operation and then an asignation", () => {
    expect(parse("{Float.`/` X Y Z}")).toEqual(
      buildInOperatorStatement("Float", "/", [
        lexicalVariable("X"),
        lexicalVariable("Y"),
        lexicalVariable("Z"),
      ]),
    );
  });

  it("make two variables of type Record apply dot operation and then an asignation", () => {
    expect(parse("{Record.`.` X Y Z}")).toEqual(
      buildInOperatorStatement("Record", ".", [
        lexicalVariable("X"),
        lexicalVariable("Y"),
        lexicalVariable("Z"),
      ]),
    );
  });

  it("check if a variable is procedure operation and then an asignation", () => {
    expect(parse("{IsProcedure X Y}")).toEqual(
      buildInOperatorStatement("Procedure", "IsProcedure", [
        lexicalVariable("X"),
        lexicalVariable("Y"),
      ]),
    );
  });

  it("apply arity operation over a variable and then an asignation", () => {
    expect(parse("{Arity X Y}")).toEqual(
      buildInOperatorStatement("Record", "Arity", [
        lexicalVariable("X"),
        lexicalVariable("Y"),
      ]),
    );
  });

  it("apply label operation over a variable and then an asignation", () => {
    expect(parse("{Label X Y}")).toEqual(
      buildInOperatorStatement("Record", "Label", [
        lexicalVariable("X"),
        lexicalVariable("Y"),
      ]),
    );
  });
});
