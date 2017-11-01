import Immutable from "immutable";

export const lexicalRecord = (label, features = {}) => {
  return Immutable.fromJS({
    node: "value",
    type: "record",
    value: {
      label,
      features,
    },
  });
};

export const lexicalAtom = name => {
  return lexicalRecord(name);
};

export const lexicalBoolean = value => {
  return lexicalRecord(value.toString());
};

export const lexicalTuple = (label, first, second) => {
  return lexicalRecord(label, {
    1: first,
    2: second,
  });
};

export const lexicalNil = () => {
  return lexicalRecord("nil");
};

export const lexicalList = (head, tail) => {
  return lexicalTuple("|", head, tail);
};

export const lexicalComplexList = array => {
  return array.reduceRight(
    (result, item) => lexicalList(lexicalVariable(item), result),
    lexicalNil(),
  );
};

export const lexicalString = value => {
  if (value === "") {
    return lexicalNil();
  }

  return lexicalList(value.charCodeAt(0), lexicalString(value.substring(1)));
};

export const lexicalNumber = value => {
  return Immutable.fromJS({
    node: "value",
    type: "number",
    value,
  });
};

export const lexicalVariable = identifier => {
  return Immutable.fromJS({
    node: "variable",
    identifier,
  });
};
