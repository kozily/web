@builtin "whitespace.ne"
@include "app/oz/grammar/lexical.nearley"

main -> _ sequence_statement _ {%
  function (d) {
    return d[1];
  }
%}

sequence_statement ->
    statement __ sequence_statement {%
      function (d) {
        return { node: 'statement', type: 'sequence', head: d[0], tail: d[2] };
      }
    %}
  | statement {% id %}

statement ->
    skip_statement {% id %}
  | local_statement {% id %}
  | binding_statement {% id %}

skip_statement -> "skip" {%
  function (d) {
    return {
      node: 'statement',
      type: 'skip'
    };
  }
%}

local_statement -> "local" __ lexical_variable __ "in" __ sequence_statement __ "end" {%
  function(d) {
    return {
      node: 'statement',
      type: 'local',
      variable: d[2],
      statement: d[6],
    };
  }
%}

binding_statement -> lexical_variable _ "=" _ lexical_variable {%
  function(d, position, reject) {
    return {
      node: 'statement',
      type: 'binding',
      lhs: d[0],
      rhs: d[4],
    };
  }
%}
