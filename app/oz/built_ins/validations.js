export const binaryOperator = args => {
  return args.size === 2;
};

export const unaryOperator = args => {
  return args.size === 1;
};

export const typedOperator = type => args => {
  return (
    args.some(arg => arg.get("value") === undefined) ||
    args.every(arg => arg.getIn(["value", "type"]) === type)
  );
};

export const typedArgument = (type, index) => args => {
  return (
    args.some(arg => arg.get("value") === undefined) ||
    args.getIn([index, "value", "type"]) === type
  );
};

export const dividendNotZero = args => {
  return (
    args.getIn([1, "value"]) === undefined ||
    args.getIn([1, "value", "value"]) !== 0
  );
};
