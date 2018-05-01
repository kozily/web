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

export const literalFunction = (args = [], expression, statement) => {
  return Immutable.fromJS({
    node: "literal",
    type: compilableLiteralTypes.function,
    value: {
      args,
      expression,
      statement,
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

export const literalList = (items = []) => {
  return items.reduceRight(
    (result, item) => literalListItem(item, result),
    literalAtom("nil"),
  );
};

export const literalString = value => {
  const items = value.split("").map(s => literalNumber(s.charCodeAt(0)));
  return literalList(items);
};
