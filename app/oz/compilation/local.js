import { localStatement } from "../machine/statements";

export default (recurse, statement) => {
  const childStatement = recurse(statement.get("statement"));
  const identifiers = statement.get("identifiers");

  return identifiers.reduceRight(
    (child, identifier) => localStatement(identifier, child),
    childStatement,
  );
};
