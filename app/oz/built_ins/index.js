import Number from "./number";
import Float from "./float";
import Record from "./record";
import Value from "./value";
import IsDet from "./isdet";
import Arity from "./arity";
import Label from "./label";

export const namespacedBuiltIns = {
  Number,
  Float,
  Record,
  Value,
};

export const noNamespacedBuiltIns = {
  IsDet,
  Arity,
  Label,
};

export const allNamespacedBuiltInTypes = Object.keys(namespacedBuiltIns);

export const allNoNamespacedBuiltInTypes = Object.keys(noNamespacedBuiltIns);

export const allBuiltInTypes = allNamespacedBuiltInTypes.concat(
  allNoNamespacedBuiltInTypes,
);
