export default (recurse, node, identation) => {
  const head = node.get("head");
  const tail = node.get("tail");
  const printededHead = recurse(head, identation);
  const printededTail = recurse(tail, identation);
  return {
    abbreviated: `${printededHead.abbreviated} ... (sequence)`,
    full: `${printededHead.full}\n${printededTail.full}`,
  };
};
