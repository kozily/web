import Immutable from 'immutable';

export default {
  sequence(head, tail) {
    return Immutable.fromJS({
      node: 'statement',
      type: 'sequence',
      head,
      tail,
    });
  },

  skip() {
    return Immutable.fromJS({
      node: 'statement',
      type: 'skip',
    });
  },

  local(variable, statement) {
    return new Immutable.Map({
      node: 'statement',
      type: 'local',
      variable,
      statement,
    });
  },
};
