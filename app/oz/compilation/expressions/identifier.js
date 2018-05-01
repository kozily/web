export default (recurse, node) => {
  return {
    resultingExpression: node,
    augmentStatement: statement => statement,
  };
};
