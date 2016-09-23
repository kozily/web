import Immutable from 'immutable';

const reducers = {
  skip(state) {
    return state;
  },
};

function reduce(state, statement) {
  const nodeType = statement.getIn(['statement', 'node']);
  if (nodeType !== 'statement') {
    throw new Error(`Unable to execute statement ${nodeType}`);
  }

  const statementType = statement.getIn(['statement', 'statement']);
  const reducer = reducers[statementType];

  if (!reducer) {
    throw new Error(`Unable to find reducer for statement ${statementType}`);
  }

  return reducer(state, statement);
}

export default {
  build(ast) {
    return new Immutable.Map({
      stack: new Immutable.Stack().push(new Immutable.Map({
        statement: ast,
        environment: new Immutable.Map(),
      })),
      store: new Immutable.Map(),
    });
  },

  isFinal(state) {
    return state.get('stack').isEmpty();
  },

  step(state) {
    return reduce(
      state.update('stack', stack => stack.pop()),
      state.get('stack').peek()
    );
  },
};

