@include "app/oz/grammar/literals.nearley"

statement ->
  skip_statement {% id %}

skip_statement -> "skip" {%
  function (d) {
    return { node: 'statement', statement: 'skip' };
  }
%}

