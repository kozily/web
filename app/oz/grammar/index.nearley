@builtin "whitespace.ne"
@include "app/oz/grammar/literals.nearley"

main -> _ sequence_statement _ {%
  function (d) {
    return d[1];
  }
%}

sequence_statement ->
    statement __ sequence_statement {%
      function (d) {
        return { node: 'statement', statement: 'sequence', head: d[0], tail: d[2] };
      }
    %}
  | statement {% id %}

statement -> skip_statement {% id %}

skip_statement -> "skip" {%
  function (d) {
    return { node: 'statement', statement: 'skip' };
  }
%}

