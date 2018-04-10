import {
  localStatement,
  procedureApplicationStatement,
  sequenceStatement,
  valueCreationStatement,
} from "../machine/statements";
import { literalAtom } from "../machine/literals";
import { lexicalIdentifier, lexicalRecordSelection } from "../machine/lexical";
import { makeAuxiliaryIdentifier } from "../machine/build";

const buildRecordSelection = (lhs, rhs, result) => {
  const recordSelectionProcedureApp = procedureApplicationStatement(
    lexicalRecordSelection("Record", literalAtom(".")),
    [lexicalIdentifier(lhs), lexicalIdentifier(rhs), lexicalIdentifier(result)],
  );
  return recordSelectionProcedureApp;
};

export default (recurse, statement) => {
  const rhsNode = statement.getIn(["rhs", "node"]);
  if (rhsNode === "identifier") {
    return buildRecordSelection(
      statement.getIn(["lhs", "identifier"]),
      statement.getIn(["rhs", "identifier"]),
      statement.getIn(["result", "identifier"]),
    );
  } else {
    const aux = makeAuxiliaryIdentifier();
    return localStatement(
      aux,
      sequenceStatement(
        valueCreationStatement(aux, statement.get("rhs")),
        buildRecordSelection(
          statement.getIn(["lhs", "identifier"]),
          aux.get("identifier"),
          statement.getIn(["result", "identifier"]),
        ),
      ),
    );
  }
};
