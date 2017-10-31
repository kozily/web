import Immutable from "immutable";

export default {
  record(label, features = {}) {
    return Immutable.fromJS({
      node: "value",
      type: "record",
      value: {
        label,
        features,
      },
    });
  },

  atom(name) {
    return this.record(name);
  },

  boolean(value) {
    return this.record(value.toString());
  },

  tuple(label, first, second) {
    return this.record(label, {
      1: first,
      2: second,
    });
  },

  nil() {
    return this.record("nil");
  },

  list(head, tail) {
    return this.tuple("|", head, tail);
  },

  complexList(array) {
    return array.reduceRight(
      (result, item) => this.list(this.variable(item), result),
      this.nil(),
    );
  },

  string(value) {
    if (value === "") {
      return this.nil();
    }

    return this.list(value.charCodeAt(0), this.string(value.substring(1)));
  },

  number(value) {
    return Immutable.fromJS({
      node: "value",
      type: "number",
      value,
    });
  },

  variable(identifier) {
    return Immutable.fromJS({
      node: "variable",
      identifier,
    });
  },
};
