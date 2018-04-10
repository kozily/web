import {
  localStatement,
  procedureApplicationStatement,
  sequenceStatement,
  valueCreationStatement,
} from "../machine/statements";
import { literalAtom } from "../machine/literals";
import { lexicalIdentifier, lexicalRecordSelection } from "../machine/lexical";

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
    return localStatement(
      lexicalIdentifier("__AUX_ARG__"),
      sequenceStatement(
        valueCreationStatement(
          lexicalIdentifier("__AUX_ARG__"),
          statement.get("rhs"),
        ),
        buildRecordSelection(
          statement.getIn(["lhs", "identifier"]),
          "__AUX_ARG__",
          statement.getIn(["result", "identifier"]),
        ),
      ),
    );
  }
};
