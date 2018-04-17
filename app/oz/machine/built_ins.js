import { valueTypes, valueNumber } from "./values";

const binaryOperator = args => {
  return args.size === 2;
};

const typedOperator = type => args => {
  return args.every(arg => arg.get("type") === type);
};

const dividendNotZero = args => {
  return args.getIn([1, "value"]) !== 0;
};

const binaryNumberOperator = (
  name,
  operation,
  additionalArgsValidations = () => true,
) => {
  return {
    name,
    validateArgs: args =>
      binaryOperator(args) &&
      typedOperator(valueTypes.number)(args) &&
      additionalArgsValidations(args),
    computeValue: args => {
      const arg1 = args.get(0);
      const arg2 = args.get(1);
      return valueNumber(operation(arg1.get("value"), arg2.get("value")));
    },
  };
};

export const builtIns = {
  Number: {
    "+": binaryNumberOperator("NumberAddition", (lhs, rhs) => lhs + rhs),
    "-": binaryNumberOperator("NumberSubtraction", (lhs, rhs) => lhs - rhs),
    "*": binaryNumberOperator("NumberMultiplication", (lhs, rhs) => lhs * rhs),
    div: binaryNumberOperator(
      "NumberDivision",
      (lhs, rhs) => Math.floor(lhs / rhs),
      dividendNotZero,
    ),
    mod: binaryNumberOperator(
      "NumberModulo",
      (lhs, rhs) => lhs % rhs,
      dividendNotZero,
    ),
  },
  Float: {
    "/": binaryNumberOperator(
      "FloatDivision",
      (lhs, rhs) => lhs / rhs,
      dividendNotZero,
    ),
  },
  Record: {
    ".": {
      name: "RecordFeatureSelection",
      validateArgs: args => {
        return (
          binaryOperator(args) &&
          args.getIn([0, "type"]) === valueTypes.record &&
          args.getIn([1, "type"]) === valueTypes.record &&
          args.getIn([1, "value", "features"]).isEmpty()
        );
      },
    },
  },
};

export const allBuiltInTypes = Object.keys(builtIns);
