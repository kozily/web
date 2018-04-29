import { portSendStatement } from "../machine/statements";

export default (recurse, node) => {
  const value = recurse(node.get("value"));
  const port = node.get("port");
  return portSendStatement(port, value);
};
