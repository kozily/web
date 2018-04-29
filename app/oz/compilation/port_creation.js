import { portCreationStatement } from "../machine/statements";

export default (recurse, node) => {
  const value = node.get("value");
  const port = node.get("port");
  return portCreationStatement(value, port);
};
