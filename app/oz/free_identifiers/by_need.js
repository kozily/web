export default (recurse, statement) => {
  const neededIdentifier = statement.getIn(["neededIdentifier", "identifier"]);
  return recurse(statement.get("procedure")).add(neededIdentifier);
};
