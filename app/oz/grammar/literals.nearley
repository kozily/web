@include "app/oz/grammar/literals_numbers.nearley"

literal ->
    number {% id %}

