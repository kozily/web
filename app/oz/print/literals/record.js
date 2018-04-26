const printLabel = label => {
  const unquotedRegex = /^[a-z].*$/;
  if (unquotedRegex.test(label)) {
    return label;
  }

  return `'${label}'`;
};

const printValue = (recurse, node) => {
  if (node.get("node") === "literal") {
    return recurse(node);
  }

  const printed = node.get("identifier");
  return {
    abbreviated: printed,
    full: printed,
  };
};

const isInteger = value => {
  const integerRegex = /^\d+$/;
  return integerRegex.test(value);
};

const printGenericRecord = (recurse, label, features) => {
  const printedFeatures = features
    .entrySeq()
    .sortBy(entry => entry[0])
    .map(entry => ({
      feature: entry[0],
      value: printValue(recurse, entry[1]),
    }));

  const abbreviatedFeatures = printedFeatures.map(
    entry => `${entry.feature}:${entry.value.abbreviated}`,
  );
  const fullFeatures = printedFeatures.map(
    entry => `${entry.feature}:${entry.value.full}`,
  );

  return {
    abbreviated: `${printLabel(label)}(${abbreviatedFeatures.join(" ")})`,
    full: `${printLabel(label)}(${fullFeatures.join(" ")})`,
  };
};

const collectListRecordItems = (recurse, label, features) => {
  if (label === "nil") {
    return [""];
  }

  const firstItem = printValue(recurse, features.get("1")).abbreviated;
  const tail = features.get("2");
  const tailLabel = tail.getIn(["value", "label"]);
  const tailFeatures = tail.getIn(["value", "features"]);

  return [firstItem].concat(
    collectListRecordItems(recurse, tailLabel, tailFeatures),
  );
};

const printListRecord = (recurse, label, features) => {
  const items = collectListRecordItems(recurse, label, features).filter(
    x => !!x,
  );
  return `[${items.join(" ")}]`;
};

const printTupleRecord = (recurse, label, features) => {
  const printedFeatures = features
    .entrySeq()
    .sortBy(entry => parseInt(entry[0]))
    .map(entry => `${printValue(recurse, entry[1]).abbreviated}`)
    .join(" ");

  return `${printLabel(label)}(${printedFeatures})`;
};

export default (recurse, node) => {
  const value = node.get("value");
  const label = value.get("label");
  const features = value.get("features");
  if (features.isEmpty()) {
    const printedLabel = printLabel(label);
    return { abbreviated: printedLabel, full: printedLabel };
  }

  if (label === "|") {
    const printed = printListRecord(recurse, label, features);
    return {
      abbreviated: printed,
      full: printed,
    };
  }

  if (features.keySeq().every(key => isInteger(key))) {
    const printed = printTupleRecord(recurse, label, features);
    return {
      abbreviated: printed,
      full: printed,
    };
  }

  return printGenericRecord(recurse, label, features);
};
