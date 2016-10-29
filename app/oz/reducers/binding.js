import Immutable from 'immutable';

const equivalenceClassContains = variable => equivalenceClass => (
  equivalenceClass.get('variables').some(x => Immutable.is(x, variable))
);

const lookupEquivalenceClass = (state, semanticStatement, side) => {
  const identifier = semanticStatement.getIn(['statement', side, 'identifier']);
  const variable = semanticStatement.getIn(['environment', identifier]);

  return state.get('store').find(equivalenceClassContains(variable));
};

const pushVariablesFrom = equivalenceClass => variables => (
  variables.concat(equivalenceClass.get('variables'))
);

const mergeEquivalenceClasses = (store, target, from) => {
  const targetIndex = store.findKey(x => Immutable.is(target, x));
  const fromIndex = store.findKey(x => Immutable.is(from, x));

  if (targetIndex === fromIndex) {
    return store;
  }

  return store
    .delete(fromIndex)
    .updateIn([targetIndex, 'variables'], pushVariablesFrom(from));
};

const isBound = equivalenceClass => (
  equivalenceClass.get('value') !== undefined
);

export default function (state, semanticStatement) {
  const lhs = lookupEquivalenceClass(state, semanticStatement, 'lhs');
  const lhsBound = isBound(lhs);
  const rhs = lookupEquivalenceClass(state, semanticStatement, 'rhs');
  const rhsBound = isBound(rhs);

  if (lhsBound && rhsBound) {
    // TODO: Unify this two partial values. This requires us implementing
    // variable-value bindings
    return state;
  }

  const [target, from] = rhsBound ? [rhs, lhs] : [lhs, rhs];
  return state.update('store', store => mergeEquivalenceClasses(store, target, from));
}
