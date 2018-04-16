import { valueTypes, valueNumber } from "./values";

export const builtInTypes = {
  Number: "Number",
  Float: "Float",
};
export const allBuiltInTypes = Object.keys(builtInTypes);

const typeValidation = (arg1, arg2, type) => {
  if (arg1.get("type") != arg2.get("type") || arg1.get("type") !== type) {
    throw new Error(`Some of the arguments are not ${type}`);
  }
};

export const builtIns = {
  [builtInTypes.Number]: {
    "+": {
      name: "Numberaddition",
      handler: args => {
        const arg1 = args.get(0);
        const arg2 = args.get(1);
        typeValidation(arg1, arg2, valueTypes.number);
        return valueNumber(arg1.get("value") + arg2.get("value"));
      },
    },
    "-": {
      name: "Numbersubtraction",
      handler: args => {
        const arg1 = args.get(0);
        const arg2 = args.get(1);
        typeValidation(arg1, arg2, valueTypes.number);
        return valueNumber(arg1.get("value") - arg2.get("value"));
      },
    },
    "*": {
      name: "Numbermultiplication",
      handler: args => {
        const arg1 = args.get(0);
        const arg2 = args.get(1);
        typeValidation(arg1, arg2, valueTypes.number);
        return valueNumber(arg1.get("value") * arg2.get("value"));
      },
    },
    "/": {
      name: "Numberdivision",
      handler: args => {
        const arg1 = args.get(0);
        const arg2 = args.get(1);
        typeValidation(arg1, arg2, valueTypes.number);
        const divisor = arg2.get("value");
        if (divisor === 0) throw new Error("cannot divide by zero");
        return valueNumber(Math.floor(arg1.get("value") / divisor));
      },
    },
  },
  [builtInTypes.Float]: {
    "/": {
      name: "Floatdivision",
      handler: args => {
        const arg1 = args.get(0);
        const arg2 = args.get(1);
        typeValidation(arg1, arg2, valueTypes.number);
        const divisor = arg2.get("value");
        if (divisor === 0) throw new Error("cannot divide by zero");
        return valueNumber(arg1.get("value") / divisor);
      },
    },
  },
};
