import Number from "./number";
import Float from "./float";
import Record from "./record";
import Value from "./value";
import IsDet from "./isdet";

export const namespacedBuiltIns = {
  Number,
  Float,
  Record,
  Value,
};

export const noNamespacedBuiltIns = {
  IsDet,
};

export const allNamespacedBuiltInTypes = Object.keys(namespacedBuiltIns);

export const allNoNamespacedBuiltInTypes = Object.keys(noNamespacedBuiltIns);

export const allBuiltInTypes = allNamespacedBuiltInTypes.concat(
  allNoNamespacedBuiltInTypes,
);
