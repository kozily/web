import Immutable from "immutable";
import { compile } from "../../app/oz/compilation";
import { operatorStatementSyntax } from "../../app/oz/machine/statementSyntax";
import {
  procedureApplicationStatement,
  localStatement,
  sequenceStatement,
  valueCreationStatement,
} from "../../app/oz/machine/statements";
import {
  lexicalIdentifier,
  lexicalRecordSelection,
} from "../../app/oz/machine/lexical";
import { literalAtom } from "../../app/oz/machine/literals";
import { getLastAuxiliaryIdentifier } from "../../app/oz/machine/build";

describe("Compiling binding statements", () => {
  beforeEach(() => {
    jasmine.addCustomEqualityTester(Immutable.is);
  });

  it("compiles appropriately when using atoms on the rhs", () => {
    const statement = operatorStatementSyntax(
      lexicalIdentifier("X"),
      lexicalIdentifier("Y"),
      literalAtom("feature"),
    );

    expect(compile(statement)).toEqual(
      localStatement(
        getLastAuxiliaryIdentifier(),
        sequenceStatement(
          valueCreationStatement(
            getLastAuxiliaryIdentifier(),
            literalAtom("feature"),
          ),
          procedureApplicationStatement(
            lexicalRecordSelection("Record", literalAtom(".")),
            [
              lexicalIdentifier("Y"),
              getLastAuxiliaryIdentifier(),
              lexicalIdentifier("X"),
            ],
          ),
        ),
      ),
    );
  });

  it("compiles appropriately when using identifiers on the rhs", () => {
    const statement = operatorStatementSyntax(
      lexicalIdentifier("X"),
      lexicalIdentifier("Y"),
      lexicalIdentifier("F"),
    );

    expect(compile(statement)).toEqual(
      procedureApplicationStatement(
        lexicalRecordSelection("Record", literalAtom(".")),
        [
          lexicalIdentifier("Y"),
          lexicalIdentifier("F"),
          lexicalIdentifier("X"),
        ],
      ),
    );
  });
});
