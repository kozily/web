const printLabel = label => {
  const unquotedRegex = /^[a-z].*$/;
  if (unquotedRegex.test(label)) {
    return label;
  }

  return `'${label}'`;
};

const printValuePosition = node => {
  if (node.get("node") === "identifier") {
    return node.get("identifier");
  }

  return `${node.get("name")}${node.get("sequence")}`;
};

const isInteger = value => {
  const integerRegex = /^\d+$/;
  return integerRegex.test(value);
};

const printTupleRecord = (label, features) => {
  const printedFeatures = features
    .entrySeq()
    .sortBy(entry => parseInt(entry[0]))
    .map(entry => `${printValuePosition(entry[1])}`)
    .join(" ");

  return `${printLabel(label)}(${printedFeatures})`;
};

const printGenericRecord = (label, features) => {
  const printedFeatures = features
    .entrySeq()
    .sortBy(entry => entry[0])
    .map(entry => `${entry[0]}:${printValuePosition(entry[1])}`)
    .join(" ");

  return `${printLabel(label)}(${printedFeatures})`;
};

const printSpecificRecord = (label, features) => {
  if (features.isEmpty()) {
    return printLabel(label);
  }

  if (features.keySeq().every(key => isInteger(key))) {
    return printTupleRecord(label, features);
  }

  return printGenericRecord(label, features);
};

export default (recurse, node) => {
  const value = node.get("value");
  const label = value.get("label");
  const features = value.get("features");
  const result = `${printSpecificRecord(label, features)}`;
  return {
    abbreviated: result,
    full: result,
  };
};
