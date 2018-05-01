import printIdentifier from "../identifier";

export default (recurse, node, identation) => {
  const ident = new Array(identation + 1).join(" ");
  const identifier = printIdentifier(node.getIn(["identifier", "identifier"]));
  const statement = recurse(node.get("statement"), identation + 2);
  return {
    abbreviated: `${ident}local ${identifier} in ... end`,
    full: `${ident}local ${identifier} in
${statement.full}
${ident}end`,
  };
};
