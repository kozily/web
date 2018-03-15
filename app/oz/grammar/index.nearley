@builtin "whitespace.ne"
@include "./lexical.nearley"

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
  | value_creation_statement {% id %}
  | conditional_statement {% id %}
  | pattern_matching_statement {% id %}

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

value_creation_statement -> lexical_variable _ "=" _ lexical_value {%
  function(d, position, reject) {
    return {
      node: 'statement',
      type: 'valueCreation',
      lhs: d[0],
      rhs: d[4],
    };
  }
%}

conditional_statement -> "if" __ lexical_variable __ "then" __ sequence_statement __ "else" __ sequence_statement __ "end" {%
  function(d, position, reject) {
    return {
      node: "statement",
      type: "conditional",
      condition: d[2],
      true_statement: d[6],
      false_statement: d[10],
    }
  }
%}

pattern_matching_statement -> "case" __ lexical_variable __ "of" __ lexical_record __ "then" __ sequence_statement __ "else" __ sequence_statement __ "end" {%
  function(d, position, reject) {
    return {
      node: "statement",
      type: "patternMatching",
      variable: d[2],
      pattern: d[6],
      true_statement: d[10],
      false_statement: d[14],
    }
  }
%}
