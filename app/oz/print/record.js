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

const collectListRecordItems = (label, features) => {
  if (label === "nil") {
    return [""];
  }

  const firstItem = printValuePosition(features.get("1"));
  const tail = features.get("2");
  const tailLabel = tail.getIn(["value", "label"]);
  const tailFeatures = tail.getIn(["value", "features"]);

  return [firstItem].concat(collectListRecordItems(tailLabel, tailFeatures));
};

const printListRecord = (label, features) => {
  const items = collectListRecordItems(label, features).filter(x => !!x);
  return `[${items.join(" ")}]`;
};

const printTupleRecord = (label, features) => {
  const printedFeatures = features
    .entrySeq()
    .sortBy(entry => parseInt(entry[0]))
    .map(entry => `${printValuePosition(entry[1])}`)
    .join(" ");

  return `${label}(${printedFeatures})`;
};

const printGenericRecord = (label, features) => {
  const printedFeatures = features
    .entrySeq()
    .sortBy(entry => entry[0])
    .map(entry => `${entry[0]}:${printValuePosition(entry[1])}`)
    .join(" ");

  return `${label}(${printedFeatures})`;
};

const printSpecificRecord = (label, features) => {
  if (features.isEmpty()) {
    return label;
  }

  if (label === "|") {
    return printListRecord(label, features);
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