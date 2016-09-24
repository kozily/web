@{%
  function literalBoolean(d) { return { node: 'literal', type: 'boolean', value: d }; }
%}

boolean ->
    true_literal {% id %}
  | false_literal {% id %}

true_literal -> "true" {%
  function (d) {
    return literalBoolean(true);
  }
%}

false_literal -> "false" {%
  function (d) {
    return literalBoolean(false);
  }
%}
