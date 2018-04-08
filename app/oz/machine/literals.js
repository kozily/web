import Immutable from "immutable";

export const literalRecord = (label, features = {}) => {
  return Immutable.fromJS({
    node: "literal",
    type: "record",
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
    literalRecord("nil"),
  );
};

export const literalString = value => {
  if (value === "") {
    return literalList();
  }

  return literalListItem(
    value.charCodeAt(0),
    literalString(value.substring(1)),
  );
};

export const literalNumber = value => {
  return Immutable.fromJS({
    node: "literal",
    type: "number",
    value,
  });
};

export const literalProcedure = (args = [], body) => {
  return Immutable.fromJS({
    node: "literal",
    type: "procedure",
    value: {
      args,
      body,
    },
  });
};
