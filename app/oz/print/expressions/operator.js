export default (recurse, node, identation) => {
  const operator = node.get("operator");
  const spacedOperator = operator === "." ? "." : ` ${operator} `;

  const lhs = node.get("lhs");
  const printedlhs = recurse(lhs, identation);
  const parenlhs =
    lhs.get("type") === "operator" ? `(${printedlhs.full})` : printedlhs.full;

  const rhs = node.get("rhs");
  const printedrhs = recurse(rhs, identation);
  const parenrhs =
    rhs.get("type") === "operator" ? `(${printedrhs.full})` : printedrhs.full;

  const result = `${parenlhs}${spacedOperator}${parenrhs}`;

  return {
    abbreviated: result,
    full: result,
  };
};
