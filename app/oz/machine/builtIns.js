import { valueTypes, valueNumber } from "./values";
import { raiseSystemException, errorException } from "./exceptions";

export const builtInTypes = {
  Number: "Number",
};
export const allBuiltInTypes = Object.keys(builtInTypes);

export const builtIns = {
  [builtInTypes.Number]: {
    "+": {
      name: "Numberplus",
      handler: (args, state, activeThreadIndex) => {
        const arg1 = args.get(0);
        const arg2 = args.get(1);
        if (
          arg1.get("type") != arg2.get("type") &&
          arg1.get("type") === valueTypes.number
        ) {
          return raiseSystemException(
            state,
            activeThreadIndex,
            errorException(),
          );
        }
        return valueNumber(arg1.get("value") + arg2.get("value"));
      },
    },
  },
};
