export default identifier => {
  const unquotedRegex = /^[A-Z][a-zA-Z0-9]*$/;
  if (unquotedRegex.test(identifier)) {
    return identifier;
  }

  return "`" + identifier + "`";
};
