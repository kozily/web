import { valueTypes, valueNumber } from "./values";
import { lookupVariableInSigma } from "../machine/sigma";

const binaryOperator = args => {
  return args.size === 2;
};

const typedOperator = type => args => {
  return args.every(arg => arg.get("type") === type);
};

const dividendNotZero = args => {
  return args.getIn([1, "value"]) !== 0;
};

export const builtIns = {
  Number: {
    "+": {
      name: "nsum",
      validateArgs: args =>
        binaryOperator(args) && typedOperator(valueTypes.number)(args),
      evaluate: args => {
        const lhs = args.getIn([0, "value"]);
        const rhs = args.getIn([1, "value"]);
        if (!lhs) {
          return { missingArg: 0 };
        }
        if (!rhs) {
          return { missingArg: 1 };
        }
        const value = valueNumber(lhs + rhs);
        return { value };
      },
    },
    "-": {
      name: "nsub",
      validateArgs: args =>
        binaryOperator(args) && typedOperator(valueTypes.number)(args),
      evaluate: args => {
        const lhs = args.getIn([0, "value"]);
        const rhs = args.getIn([1, "value"]);
        if (!lhs) {
          return { missingArg: 0 };
        }
        if (!rhs) {
          return { missingArg: 1 };
        }
        const value = valueNumber(lhs - rhs);
        return { value };
      },
    },
    "*": {
      name: "nmul",
      validateArgs: args =>
        binaryOperator(args) && typedOperator(valueTypes.number)(args),
      evaluate: args => {
        const lhs = args.getIn([0, "value"]);
        const rhs = args.getIn([1, "value"]);
        if (!lhs) {
          return { missingArg: 0 };
        }
        if (!rhs) {
          return { missingArg: 1 };
        }
        const value = lhs && rhs ? valueNumber(lhs * rhs) : undefined;
        return { value };
      },
    },
    div: {
      name: "ndiv",
      validateArgs: args =>
        binaryOperator(args) &&
        typedOperator(valueTypes.number)(args) &&
        dividendNotZero(args),
      evaluate: args => {
        const lhs = args.getIn([0, "value"]);
        const rhs = args.getIn([1, "value"]);
        if (!lhs) {
          return { missingArg: 0 };
        }
        if (!rhs) {
          return { missingArg: 1 };
        }
        const value =
          lhs && rhs ? valueNumber(Math.floor(lhs / rhs)) : undefined;
        return { value };
      },
    },
    mod: {
      name: "nmod",
      validateArgs: args =>
        binaryOperator(args) &&
        typedOperator(valueTypes.number)(args) &&
        dividendNotZero(args),
      evaluate: args => {
        const lhs = args.getIn([0, "value"]);
        const rhs = args.getIn([1, "value"]);
        if (!lhs) {
          return { missingArg: 0 };
        }
        if (!rhs) {
          return { missingArg: 1 };
        }
        const value = valueNumber(lhs % rhs);
        return { value };
      },
    },
  },
  Float: {
    "/": {
      name: "fdiv",
      validateArgs: args =>
        binaryOperator(args) &&
        typedOperator(valueTypes.number)(args) &&
        dividendNotZero(args),
      evaluate: args => {
        const lhs = args.getIn([0, "value"]);
        const rhs = args.getIn([1, "value"]);
        if (!lhs) {
          return { missingArg: 0 };
        }
        if (!rhs) {
          return { missingArg: 1 };
        }
        const value = valueNumber(lhs / rhs);
        return { value };
      },
    },
  },
  Record: {
    ".": {
      name: "rsel",
      validateArgs: args =>
        binaryOperator(args) &&
        args.getIn([0, "type"]) === valueTypes.record &&
        args.getIn([1, "type"]) === valueTypes.record &&
        args.getIn([1, "value", "features"]).isEmpty() &&
        !!args.getIn([
          0,
          "value",
          "features",
          args.getIn([1, "value", "label"]),
        ]),
      evaluate: (args, sigma) => {
        const record = args.getIn([0, "value"]);
        const feature = args.getIn([1, "value", "label"]);
        if (!record) {
          return { missingArg: 0 };
        }
        if (!feature) {
          return { missingArg: 1 };
        }
        const variable = record.getIn(["features", feature]);
        const value = lookupVariableInSigma(sigma, variable).get("value");
        return { value, variable };
      },
    },
  },
};

export const allBuiltInTypes = Object.keys(builtIns);
