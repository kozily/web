import { lookupVariableInStore } from "../machine/store";
import { lexicalNumber } from "../../../specs/samples/lexical";
import Immutable from "immutable";

class ValueOperation {
  constructor() {
    this.node = "Value";
    this.operations = Immutable.Map({
      "==": this.equals,
      "\\=": this.assign,
      "<": this.lessThan,
      "=<": this.equalOrLessThan,
      ">": this.greaterThan,
      ">=": this.equalOrGreaterThan,
    });
  }
  equals(a, b) {
    return a === b;
  }
  assign(a, b) {
    return (a = b);
  }
  lessThan(a, b) {
    return a < b;
  }
  equalOrLessThan(a, b) {
    return a <= b;
  }
  greaterThan(a, b) {
    return a > b;
  }
  equalOrGreaterThan(a, b) {
    return a >= b;
  }
}

class NumberOperation extends ValueOperation {
  constructor() {
    super();
    this.type = "Number";
    var current = Immutable.Map({
      "+": this.sum,
      "-": this.substract,
      "*": this.multiplicate,
      "/": this.divide,
      mod: this.mod,
    });
    this.operations = this.operations.merge(current);
  }
  sum(a, b) {
    return a + b;
  }
  substract(a, b) {
    return a - b;
  }
  multiplicate(a, b) {
    return a * b;
  }
  divide(a, b) {
    if (b === 0) throw new Error("cannot divide by zero");
    return a / b;
  }
  mod(a, b) {
    return a % b;
  }
}

export default function(state, semanticStatement) {
  const store = state.get("store");
  const statement = semanticStatement.get("statement");
  const environment = semanticStatement.get("environment");

  const operator = statement.get("operator");
  const kind = statement.get("kind");
  const variables = statement.get("variables");

  // validators
  if (variables.size < 2 || variables.size > 3) {
    throw new Error(
      `The amount of variables ${identifiers} are not supported for the operation ${operator}`,
    );
  }

  // get the identifiers of the variables
  const identifiers = variables.map(x => x.get("identifier"));

  const equivalentClasses = identifiers.map(id => {
    // check what means in environment
    const variable = environment.get(id);
    // check what points in store
    const equivalentClass = lookupVariableInStore(store, variable);

    return equivalentClass;
  });

  const valuesInStore = equivalentClasses.map(x => x.get("value"));

  const validValues = valuesInStore.map((value, index) => {
    // validates that first variables must have the same kind
    if (index < variables.size) {
      if (value === undefined)
        throw new Error(
          `Unbound value in variable ${identifiers[
            index
          ]} for the operation ${operator}`,
        );

      const node = value.get("node");
      const type = value.get("type");
      //if kind is different from Value, eval the type
      if (
        (kind !== "Value" && type !== kind.toLowerCase()) ||
        (kind === "Value" && node !== kind.toLowerCase())
      )
        throw new Error(
          `The variable ${identifiers[
            index
          ]} of type ${node}-${type} is not support for the build-in operation ${kind} ${operator}`,
        );

      return value;
    }
  });

  // executes the operation
  if (validValues.size === 3) {
    const result = new NumberOperation().operations.get(operator)(
      validValues.getIn(["1", "value"]),
      validValues.getIn(["2", "value"]),
    );

    const oldEC = equivalentClasses.get("3");
    const newEC = oldEC.update("value", () => lexicalNumber(result));
    return state.update("store", store => store.delete(oldEC).add(newEC));
  }

  return state;
}
