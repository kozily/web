export default (recurse, statement) => {
  return recurse(statement.get("body"));
};
