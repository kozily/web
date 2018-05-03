export default (recurse, node, identation) => {
  const ident = new Array(identation + 1).join(" ");
  const triedStatement = recurse(node.get("triedStatement"), identation + 2)
    .full;
  const exceptionIdentifier = recurse(node.get("exceptionIdentifier"))
    .abbreviated;
  const exceptionStatement = recurse(
    node.get("exceptionStatement"),
    identation + 2,
  ).full;

  return {
    abbreviated: `${ident}try ... catch ${exceptionIdentifier} then ... end`,
    full: `${ident}try\n${triedStatement}\n${ident}catch ${exceptionIdentifier} then\n${exceptionStatement}\n${ident}end`,
  };
};
