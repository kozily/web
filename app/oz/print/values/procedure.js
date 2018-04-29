export default (recurse, node, identation) => {
  const ident = new Array(identation + 1).join(" ");
  const value = node.get("value");

  const printedArgs = value
    .get("args")
    .map(x => x.get("identifier"))
    .join(" ");
  const printedContext = value
    .get("context")
    .map((variable, identifier) =>
      identifier.concat("->", variable.get("name"), variable.get("sequence")),
    )
    .join(", ");
  const fullBody = recurse(value.get("body"), identation + 2).full;
  const abbreviatedBody = recurse(value.get("body")).abbreviated;

  return {
    abbreviated: `proc {$ ${printedArgs}} ${abbreviatedBody} end, {${printedContext}}`,
    full: `proc {$ ${printedArgs}}\n${fullBody}\n${ident}end, {${printedContext}}`,
  };
};
