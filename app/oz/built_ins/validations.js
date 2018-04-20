export const binaryOperator = args => {
  return args.size === 2;
};

export const typedOperator = type => args => {
  return args.every(arg => arg.get("type") === type);
};

export const dividendNotZero = args => {
  return args.getIn([1, "value"]) !== 0;
};
