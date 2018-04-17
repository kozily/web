@include "./grammar.ne"

index ->
    exp_expression {% id %}
