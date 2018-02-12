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
  | value_creation_statement {% id %}
  | conditional_statement {% id %}
  | build_in_operators_statement {% id %}

build_in_operators_statement ->
    build_in_three_variable_operator_statement {% id %}
  | build_in_two_variable_operator_statement {% id %}

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




##############################################################################
# Build_in operators statement
##############################################################################

@{%
  function buildInOperatorStatement(kind, operator, variables) {
    return {
      node: 'statement',
      type: 'buildInOperation',
      operator: operator,
      kind: kind,
      variables: variables.reduce(
        function(accumulator, value, index) {
          accumulator[++index] = value;
          return accumulator;
        }, {}),
    };
  }
%}

grouper_three_variables -> lexical_variable __ lexical_variable __ lexical_variable {%
  function(d) {
    return [d[0],d[2],d[4]];
  }
%}

value_conditional_operators -> "==" | "\\=" | "=<" | "<" | ">=" | ">"

number_operators -> "+" | "-" | "*" | "div" | "mod"

kind_operator_combination -> "Value" ".`" value_conditional_operators "`" {%
  function(d) {
    return {kind: d[0], operator: d[2][0]};
  }
%}
  | "Number" ".`" number_operators "`" {%
  function(d) {
    return {kind: d[0], operator: d[2][0]};
  }
%}
  | "Float" ".`" "/" "`" {%
  function(d) {
    return {kind: d[0], operator: d[2]};
  }
%}
  | "Record" ".`" "." "`" {%
  function(d) {
    return {kind: d[0], operator: d[2]};
  }
%}

build_in_three_variable_operator_statement -> "{" kind_operator_combination __ grouper_three_variables "}" {%
  function(d) {
    return buildInOperatorStatement(d[1].kind, d[1].operator, d[3]);
  }
%}

build_in_two_variable_operator_statement -> "{" two_variable_operations __ lexical_variable __ lexical_variable "}" {%
  function(d) {
    if (d[1][0] === "IsProcedure") {
      return buildInOperatorStatement("Procedure", d[1][0], [d[3], d[5]]);
    } else {
      return buildInOperatorStatement("Record", d[1][0], [d[3], d[5]]);
    } 
  }
%}

two_variable_operations -> "IsProcedure" | "Arity" | "Label"