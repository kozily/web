import Immutable from "immutable";

export const isEquivalenceClassBound = equivalenceClass => {
  return equivalenceClass.get("value") !== undefined;
};

export const lookupVariableInStore = (store, variable) => {
  return store.find(ec =>
    ec.get("variables").some(x => Immutable.is(x, variable)),
  );
};

export const mergeEquivalenceClasses = (store, target, source) => {
  const targetIndex = store.findKey(x => Immutable.is(target, x));
  const sourceIndex = store.findKey(x => Immutable.is(source, x));

  if (targetIndex === sourceIndex) {
    return store;
  }

  const sourceVariables = source.get("variables");

  return store
    .updateIn([targetIndex, "variables"], variables =>
      variables.concat(sourceVariables),
    )
    .delete(sourceIndex);
};
