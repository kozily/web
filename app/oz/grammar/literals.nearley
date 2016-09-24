@include "app/oz/grammar/literals_numbers.nearley"
@include "app/oz/grammar/literals_boolean.nearley"

literal ->
    number {% id %}
  | boolean {% id %}
