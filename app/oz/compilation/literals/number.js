export default (recurse, node) => {
  const resultingExpression = node;
  const augmentStatement = statement => statement;

  return {
    resultingExpression,
    augmentStatement,
  };
};
