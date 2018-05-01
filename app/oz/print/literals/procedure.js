import printIdentifier from "../identifier";

export default (recurse, node, identation) => {
  const ident = new Array(identation + 1).join(" ");
  const value = node.get("value");

  const printedArgs = value
    .get("args")
    .map(x => printIdentifier(x.get("identifier")))
    .join(" ");
  const fullBody = recurse(value.get("body"), identation + 2).full;
  const abbreviatedBody = recurse(value.get("body")).abbreviated;

  return {
    abbreviated: `proc {$ ${printedArgs}} ${abbreviatedBody} end`,
    full: `proc {$ ${printedArgs}}\n${fullBody}\n${ident}end`,
  };
};
