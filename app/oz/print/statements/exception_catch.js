import printIdentifier from "../identifier";

export default (recurse, node, identation) => {
  const ident = new Array(identation + 1).join(" ");
  const exceptionIdentifier = printIdentifier(
    node.getIn(["exceptionIdentifier", "identifier"]),
  );
  const exceptionStatement = recurse(
    node.get("exceptionStatement"),
    identation + 2,
  ).full;

  return {
    abbreviated: `${ident}catch ${exceptionIdentifier} then ... end`,
    full: `${ident}catch ${exceptionIdentifier} then\n${exceptionStatement}\n${ident}end`,
  };
};
