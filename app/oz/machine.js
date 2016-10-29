import Immutable from 'immutable';
import reducers from './reducers/index';

function validate(condition, message) {
  if (!condition) {
    throw new Error(message);
  }
}

function validateSemanticStatement(semanticStatement) {
  validate(
    semanticStatement.getIn(['statement', 'node']) === 'statement',
    'Semantic statement has non-executable node'
  );
  validate(
    semanticStatement.getIn(['statement', 'type']) !== undefined,
    'Semantic statement has undefined type'
  );
  return semanticStatement;
}

function validateReducer(reducer) {
  validate(
    reducer !== undefined,
    'Semantic statement has unrecognized type'
  );
  return reducer;
}

export default {
  isFinal(state) {
    return state.get('stack').isEmpty();
  },

  step(state) {
    try {
      const semanticStatement = validateSemanticStatement(
        state.get('stack').peek()
      );
      const reducer = validateReducer(
        reducers[semanticStatement.getIn(['statement', 'type'])]
      );
      const reducibleState = state.update('stack', stack => stack.pop());

      return reducer(reducibleState, semanticStatement);
    } catch (error) {
      throw new Error(`${error.message}: ${state.toString()}`);
    }
  },

  steps(state, result = new Immutable.List()) {
    const updatedResult = result.push(state);

    if (this.isFinal(state)) {
      return updatedResult;
    }

    return this.steps(this.step(state), updatedResult);
  },

  build: {
    fromKernelAST(ast) {
      return this.state(
        this.stack(this.semanticStatement(ast))
      );
    },

    state(stack = this.stack(), store = this.store()) {
      return new Immutable.Map({
        stack,
        store,
      });
    },

    store(...equivalenceClasses) {
      return new Immutable.List(equivalenceClasses);
    },

    equivalenceClass(value, ...variables) {
      return new Immutable.Map({
        value,
        variables: new Immutable.List(variables),
      });
    },

    variable(name, sequence) {
      return new Immutable.Map({
        name,
        sequence,
      });
    },

    stack(...semanticStatements) {
      return new Immutable.Stack(semanticStatements);
    },

    semanticStatement(statement, environment = this.environment()) {
      return new Immutable.Map({
        statement,
        environment,
      });
    },

    environment(contents = {}) {
      return new Immutable.Map(contents);
    },
  },
};

