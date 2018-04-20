import Immutable from "immutable";

export const valueTypes = {
  number: "number",
  record: "record",
  procedure: "procedure",
  builtIn: "builtIn",
};

export const allValueTypes = Object.keys(valueTypes);

export const valueRecord = (label, features = {}) => {
  return Immutable.fromJS({
    node: "value",
    type: "record",
    value: {
      label,
      features,
    },
  });
};

export const valueAtom = name => {
  return valueRecord(name);
};

export const valueBoolean = value => {
  return valueRecord(value.toString());
};

export const valueTuple = (label, tuples = []) => {
  return valueRecord(
    label,
    tuples.reduce((accumulator, value, index) => {
      accumulator[++index] = value;
      return accumulator;
    }, {}),
  );
};

export const valueListItem = (head, tail) => {
  return valueTuple("|", [head, tail]);
};

export const valueList = (items = []) => {
  return items.reduce(
    (result, item) => valueListItem(item, result),
    valueRecord("nil"),
  );
};

export const valueString = value => {
  if (value === "") {
    return valueList();
  }

  return valueListItem(value.charCodeAt(0), valueString(value.substring(1)));
};

export const valueNumber = value => {
  return Immutable.fromJS({
    node: "value",
    type: "number",
    value,
  });
};

export const valueProcedure = (args = [], body, context = {}) => {
  return Immutable.fromJS({
    node: "value",
    type: "procedure",
    value: {
      args,
      body,
      context,
    },
  });
};

export const valueBuiltIn = (operator, namespace) => {
  return Immutable.fromJS({
    node: "value",
    type: "builtIn",
    operator,
    namespace,
  });
};
