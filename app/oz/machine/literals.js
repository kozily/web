import Immutable from "immutable";

export const kernelLiteralTypes = {
  number: "number",
  record: "record",
  procedure: "procedure",
};

export const compilableLiteralTypes = {
  function: "function",
};

export const literalNumber = value => {
  return Immutable.fromJS({
    node: "literal",
    type: kernelLiteralTypes.number,
    value,
  });
};

export const literalProcedure = (args = [], body) => {
  return Immutable.fromJS({
    node: "literal",
    type: kernelLiteralTypes.procedure,
    value: {
      args,
      body,
    },
  });
};

export const literalFunction = (
  args = [],
  expression,
  statement,
  lazy = false,
) => {
  return Immutable.fromJS({
    node: "literal",
    type: compilableLiteralTypes.function,
    value: {
      args,
      expression,
      statement,
      lazy,
    },
  });
};

export const literalRecord = (label, features = {}) => {
  return Immutable.fromJS({
    node: "literal",
    type: kernelLiteralTypes.record,
    value: {
      label,
      features,
    },
  });
};

export const literalAtom = name => {
  return literalRecord(name);
};

export const literalBoolean = value => {
  return literalRecord(value.toString());
};

export const literalTuple = (label, tuples = []) => {
  return literalRecord(
    label,
    tuples.reduce((accumulator, value, index) => {
      accumulator[++index] = value;
      return accumulator;
    }, {}),
  );
};

export const literalListItem = (head, tail) => {
  return literalTuple("|", [head, tail]);
};

export const literalList = (items = [], wrap = x => x) => {
  return items.reduceRight(
    (result, item) => wrap(literalListItem(item, result)),
    wrap(literalAtom("nil")),
  );
};

export const literalString = (value, wrap = x => x) => {
  const items = value.split("").map(s => wrap(literalNumber(s.charCodeAt(0))));
  return literalList(items, wrap);
};
