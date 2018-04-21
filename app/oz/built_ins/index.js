import Number from "./number";
import Float from "./float";
import Record from "./record";
import Value from "./value";

export const builtIns = {
  Number,
  Float,
  Record,
  Value,
};

export const allBuiltInTypes = Object.keys(builtIns);
