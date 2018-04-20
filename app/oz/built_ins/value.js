import { entail } from "../entailment";
import { binaryOperator } from "./validations";
import { valueBoolean } from "../machine/values";

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
};
