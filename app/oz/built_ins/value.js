import Immutable from "immutable";
import { entail } from "../entailment";
import { binaryOperator } from "./validations";
import { valueTypes, valueBoolean } from "../machine/values";

const bothNumbers = args => {
  return args.every(arg => arg.getIn(["value", "type"]) === valueTypes.number);
};

const bothAtoms = args => {
  return args.every(arg => {
    return (
      arg.getIn(["value", "type"]) === valueTypes.record &&
      arg.getIn(["value", "value", "features"]).isEmpty()
    );
  });
};

const bothNumberOrAtoms = args => {
  return (
    args.some(arg => arg.get("value") === undefined) ||
    bothNumbers(args) ||
    bothAtoms(args)
  );
};

export default {
  "==": {
    name: "veq",
    validateArgs: args => binaryOperator(args),
    evaluate: (args, sigma) => {
      const entailment = entail(args, sigma);
      if (entailment.get("value") === undefined) {
        return entailment;
      }
      return entailment.update("value", value => valueBoolean(value));
    },
  },

  "\\=": {
    name: "vneq",
    validateArgs: args => binaryOperator(args),
    evaluate: (args, sigma) => {
      const entailment = entail(args, sigma);
      if (entailment.get("value") === undefined) {
        return entailment;
      }
      return entailment.update("value", value => valueBoolean(!value));
    },
  },

  "<": {
    name: "vlt",
    validateArgs: args => binaryOperator(args) && bothNumberOrAtoms(args),
    evaluate: args => {
      const missingArgument = args.find(x => !x.get("value"));
      if (missingArgument) {
        return Immutable.Map({
          waitCondition:
            missingArgument.get("waitCondition") ||
            missingArgument.get("variable"),
        });
      }
      const lhs = args.getIn([0, "value", "value"]);
      const rhs = args.getIn([1, "value", "value"]);

      const value = lhs < rhs;
      return Immutable.Map({ value: valueBoolean(value) });
    },
  },

  "<=": {
    name: "vle",
    validateArgs: args => binaryOperator(args) && bothNumberOrAtoms(args),
    evaluate: args => {
      const missingArgument = args.find(x => !x.get("value"));
      if (missingArgument) {
        return Immutable.Map({
          waitCondition:
            missingArgument.get("waitCondition") ||
            missingArgument.get("variable"),
        });
      }
      const lhs = args.getIn([0, "value", "value"]);
      const rhs = args.getIn([1, "value", "value"]);

      const value = lhs <= rhs;
      return Immutable.Map({ value: valueBoolean(value) });
    },
  },

  ">": {
    name: "vgt",
    validateArgs: args => binaryOperator(args) && bothNumberOrAtoms(args),
    evaluate: args => {
      const missingArgument = args.find(x => !x.get("value"));
      if (missingArgument) {
        return Immutable.Map({
          waitCondition:
            missingArgument.get("waitCondition") ||
            missingArgument.get("variable"),
        });
      }
      const lhs = args.getIn([0, "value", "value"]);
      const rhs = args.getIn([1, "value", "value"]);

      const value = lhs > rhs;
      return Immutable.Map({ value: valueBoolean(value) });
    },
  },

  ">=": {
    name: "vge",
    validateArgs: args => binaryOperator(args) && bothNumberOrAtoms(args),
    evaluate: args => {
      const missingArgument = args.find(x => !x.get("value"));
      if (missingArgument) {
        return Immutable.Map({
          waitCondition:
            missingArgument.get("waitCondition") ||
            missingArgument.get("variable"),
        });
      }
      const lhs = args.getIn([0, "value", "value"]);
      const rhs = args.getIn([1, "value", "value"]);

      const value = lhs >= rhs;
      return Immutable.Map({ value: valueBoolean(value) });
    },
  },
};
