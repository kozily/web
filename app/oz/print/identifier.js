export default (recurse, node) => {
  const identifier = node.get("identifier");

  if (identifier === "_") {
    return {
      abbreviated: identifier,
      full: identifier,
    };
  }

  const unquotedRegex = /^[A-Z][a-zA-Z0-9]*$/;
  const result = unquotedRegex.test(identifier)
    ? identifier
    : "`" + identifier + "`";

  return {
    abbreviated: result,
    full: result,
  };
};
