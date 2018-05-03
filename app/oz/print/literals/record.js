import { valueTypes } from "../../machine/values";

const printLabel = label => {
  const unquotedRegex = /^[a-z].*$/;
  if (unquotedRegex.test(label)) {
    return label;
  }

  return `'${label}'`;
};

const printValue = (recurse, node) => {
  return recurse(node);
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

  const tailLiteral =
    tail.get("node") === "expression" ? tail.get("literal") : tail;

  const tailLabel = tailLiteral.getIn(["value", "label"]);
  const tailFeatures = tailLiteral.getIn(["value", "features"]);

  return [firstItem].concat(
    collectListRecordItems(recurse, tailLabel, tailFeatures),
  );
};

const printCompleteListRecord = (recurse, label, features) => {
  const items = collectListRecordItems(recurse, label, features).filter(
    x => !!x,
  );
  return `[${items.join(" ")}]`;
};

const printConsListRecord = (recurse, label, features) => {
  const head = printValue(recurse, features.get("1")).abbreviated;
  const tail = printValue(recurse, features.get("2")).abbreviated;

  return `${head}|${tail}`;
};

const isLiteralCompleteList = literal => {
  if (literal.get("type") === valueTypes.record) {
    const subLabel = literal.getIn(["value", "label"]);
    const subFeatures = literal.getIn(["value", "features"]);
    if (subLabel === "|") {
      return isCompleteList(subLabel, subFeatures);
    }

    if (subLabel === "nil") {
      return true;
    }
  }

  return false;
};

const isCompleteList = (label, features) => {
  const tail = features.get("2");

  if (tail.get("node") === "expression" && tail.get("type") === "literal") {
    const literal = tail.get("literal");
    return isLiteralCompleteList(literal);
  }

  if (tail.get("node") === "literal") {
    return isLiteralCompleteList(tail);
  }

  return false;
};

const printListRecord = (recurse, label, features) => {
  if (isCompleteList(label, features)) {
    return printCompleteListRecord(recurse, label, features);
  }

  return printConsListRecord(recurse, label, features);
};

const printConsTupleRecord = (recurse, label, features) => {
  return features
    .entrySeq()
    .sortBy(entry => parseInt(entry[0], 10))
    .map(entry => printValue(recurse, entry[1]).abbreviated)
    .join("#");
};

const printGenericTupleRecord = (recurse, label, features) => {
  const printedFeatures = features
    .entrySeq()
    .sortBy(entry => parseInt(entry[0], 10))
    .map(entry => printValue(recurse, entry[1]).abbreviated)
    .join(" ");

  return `${printLabel(label)}(${printedFeatures})`;
};

const printTupleRecord = (recurse, label, features) => {
  if (label === "#") {
    return printConsTupleRecord(recurse, label, features);
  }

  return printGenericTupleRecord(recurse, label, features);
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
