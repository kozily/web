@builtin "whitespace.ne"
@builtin "postprocessors.ne"

##############################################################################
# STM - STATEMENTS
##############################################################################
# This section defines parsing rules for executable statements
##############################################################################
stm_root -> _ stm_sequence _ {% nth(1) %}

stm_sequence ->
    stm_simple __ stm_sequence {%
      function (d) {
        return { node: 'statement', type: 'sequence', head: d[0], tail: d[2] };
      }
    %}
  | stm_simple {% id %}

stm_simple ->
    stm_skip {% id %}
  | stm_local {% id %}
  | stm_binding {% id %}
  | stm_value_creation {% id %}
  | stm_conditional {% id %}
  | stm_pattern_matching {% id %}
  | stm_procedure_application {% id %}
  | stm_try {% id %}
  | stm_raise {% id %}

stm_skip -> "skip" {%
  function (d) {
    return {
      node: 'statement',
      type: 'skip'
    };
  }
%}

stm_local -> "local" __ ids_identifier __ "in" __ stm_sequence __ "end" {%
  function(d) {
    return {
      node: 'statement',
      type: 'local',
      identifier: d[2],
      statement: d[6],
    };
  }
%}

stm_binding -> ids_identifier _ "=" _ ids_identifier {%
  function(d, position, reject) {
    return {
      node: 'statement',
      type: 'binding',
      lhs: d[0],
      rhs: d[4],
    };
  }
%}

stm_value_creation -> ids_identifier _ "=" _ lit_value {%
  function(d, position, reject) {
    return {
      node: 'statement',
      type: 'valueCreation',
      lhs: d[0],
      rhs: d[4],
    };
  }
%}

stm_conditional -> "if" __ ids_identifier __ "then" __ stm_sequence __ "else" __ stm_sequence __ "end" {%
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

stm_pattern_matching -> "case" __ ids_identifier __ "of" __ lit_record_like __ "then" __ stm_sequence __ "else" __ stm_sequence __ "end" {%
  function(d, position, reject) {
    return {
      node: "statement",
      type: "patternMatching",
      identifier: d[2],
      pattern: d[6],
      true_statement: d[10],
      false_statement: d[14],
    }
  }
%}

stm_procedure_application -> "{" _ ids_identifier lit_procedure_args:? _ "}" {%
  function(d) {
    return {
      node: "statement",
      type: "procedureApplication",
      procedure: d[2],
      args: d[3] || [],
    };
  }
%}

stm_try -> "try" _ stm_sequence _ "catch" _ ids_identifier _ "then" _ stm_sequence _ "end" {%
  function(d) {
    return {
      node: "statement",
      type: "exceptionContext",
      triedStatement: d[2],
      exceptionIdentifier: d[6],
      exceptionStatement: d[10],
    };
  }
%}

stm_raise -> "raise" _ ids_identifier _ "end" {%
  function(d) {
    return {
      node: "statement",
      type: "exceptionRaise",
      identifier: d[2],
    };
  }
%}

##############################################################################
# IDS - IDENTIFIERS
##############################################################################
# This section defines parsing rules for standalone identifiers
##############################################################################
@{%
  function idsBuildIdentifier(d) {
    return {
      node: 'identifier',
      identifier: d[0],
    };
  }
%}

ids_identifier ->
    ids_identifier_syntax {% idsBuildIdentifier %}

ids_identifier_syntax ->
    ids_identifier_unquoted {% id %}
  | ids_identifier_quoted {% id %}


ids_identifier_unquoted -> [A-Z] [A-Za-z0-9_]:* {%
  function(d) {
    return "" + d[0] + d[1].join("");
  }
%}

ids_identifier_quoted -> "`" ([^`\\] | lib_pseudo_char):* "`" {%
  function(d) {
    return d[1].join("");
  }
%}

##############################################################################
# LIT - LITERALS
##############################################################################
# This section defines parsing rules for value literals, such as records, atoms
# and booleans.
##############################################################################

lit_value ->
    lit_record {% id %}
  | lit_atom {% id %}
  | lit_boolean {% id %}
  | lit_string {% id %}
  | lit_char {% id %}
  | lit_integer {% id %}
  | lit_float {% id %}
  | lit_list {% id %}
  | lit_tuple {% id %}
  | lit_procedure {% id %}

##############################################################################
# Records
##############################################################################
@{%
  function litBuildRecord(label, features) {
    return { node: 'literal', type: 'record', value: { label: label, features: features } };
  }
%}

lit_record -> lit_atom_syntax "(" _ lit_record_feature_list _ ")" {%
  function(d, position, reject) {
    var label = d[0];
    var features = d[3].reduce(function(result, item) {
      result[item.name] = item.value;
      return result;
    }, {});
    return litBuildRecord(label, features);
  }
%}

lit_record_feature_list ->
    lit_record_feature_list __ lit_record_feature {% function(d) { return d[0].concat(d[2]); } %}
  | lit_record_feature

lit_record_feature -> lit_atom_syntax ":" ids_identifier {%
  function(d, position, reject) {
    return {name: d[0], value: d[2]};
  }
%}

##############################################################################
# Atoms
##############################################################################
@{%
  function litBuildAtom(d) {
    return litBuildRecord(d[0], {});
  }

  LIT_KEYWORDS = [
    'andthen', 'at', 'attr', 'break', 'case', 'catch', 'choice', 'class',
    'collect', 'cond', 'continue', 'declare', 'default', 'define', 'dis', 'div',
    'do', 'else', 'elsecase', 'elseif', 'elseof', 'end', 'export', 'fail', 'false',
    'feat', 'finally', 'for', 'from', 'fun', 'functor', 'if', 'import', 'in',
    'lazy', 'local', 'lock', 'meth', 'mod', 'not', 'of', 'or', 'orelse', 'prepare',
    'proc', 'prop', 'raise', 'require', 'return', 'self', 'skip', 'then', 'thread',
    'true', 'try', 'unit',
  ];
%}

lit_atom ->
    lit_atom_syntax {% litBuildAtom %}

lit_atom_syntax ->
    lit_atom_unquoted {% id %}
  | lit_atom_quoted {% id %}

lit_atom_unquoted -> [a-z] [a-zA-Z0-9_]:* {%
  function(d, location, reject) {
    var name = "" + d[0] + d[1].join("");
    if (LIT_KEYWORDS.indexOf(name) === -1) {
      return name;
    } else {
      return reject;
    }
  }
%}

lit_atom_quoted -> "'" ([^'\\] | lib_pseudo_char):* "'" {%
  function(d) {
    return d[1].join("");
  }
%}

##############################################################################
# Booleans
##############################################################################
@{%
  function litBuildBoolean(d) {
    return litBuildRecord(d.toString(), {});
  }
%}

lit_boolean ->
    lit_boolean_syntax {% litBuildBoolean %}

lit_boolean_syntax ->
    lit_true_literal {% id %}
  | lit_false_literal {% id %}

lit_true_literal -> "true" {%
  function (d) {
    return true;
  }
%}

lit_false_literal -> "false" {%
  function (d) {
    return false;
  }
%}

##############################################################################
# Record-like items
##############################################################################
lit_record_like ->
    lit_record {% id %}
  | lit_atom {% id %}
  | lit_boolean {% id %}

##############################################################################
# Strings
##############################################################################
@{%
  function litBuildString(d) {
    if (d[0] === "") {
      return litBuildRecord("nil", {});
    } else {
      return litBuildRecord("|", {
        1: d[0].charCodeAt(0),
        2: litBuildString([d[0].substring(1)]),
      });
    }
  }
%}

lit_string ->
    lit_string_syntax {% litBuildString %}

lit_string_syntax -> "\"" ([^"\\] | lib_pseudo_char):* "\"" {%
  function(d) {
    return d[1].join("");
  }
%}

##############################################################################
# Generic numbers
##############################################################################
@{%
  function litBuildNumber(value) {
    return { node: 'literal', type: 'number', value: value[0] };
  }
%}

##############################################################################
# Character
##############################################################################
lit_char ->
    lit_numeric_char {% litBuildNumber %}
  | lit_quoted_char {% litBuildNumber %}
  | lit_escaped_char {% litBuildNumber %}

lit_numeric_char -> [1-9] [0-9]:* {%
  function(d, location, reject) {
    var value = parseInt("" + d[0] + d[1].join(""), 10);
    if (value > 255) {
      return reject;
    } else {
      return value;
    }
  }
%}

lit_quoted_char -> "&" [^\\] {%
  function (d) {
    return d[1].charCodeAt(0);
  }
%}

lit_escaped_char -> "&" lib_pseudo_char {%
  function(d) {
    return d[1].charCodeAt(0);
  }
%}

##############################################################################
# Integer
##############################################################################
lit_integer ->
    lit_decimal_int {% litBuildNumber %}
  | lit_octal_int {% litBuildNumber %}
  | lit_hexal_int {% litBuildNumber %}
  | lit_bin_int {% litBuildNumber %}

lit_decimal_int -> "~":? [1-9] [0-9]:* {%
  function (d, location, reject) {
    var value = parseInt(
      translateWeirdOzUnaryMinus(d[0]) +
      d[1] +
      d[2].join(""),
      10);

    if (value <= 255 && value >= 0) {
      return reject;
    } else {
      return value;
    }
  }
%}

lit_octal_int -> "~":? "0" [0-7]:+ {%
  function (d) {
    return parseInt(
      translateWeirdOzUnaryMinus(d[0]) +
      d[2].join(""),
      8);
  }
%}

lit_hexal_int -> "~":? ("0x" | "0X") [a-fA-F0-7]:+ {%
  function (d) {
    return parseInt(
      translateWeirdOzUnaryMinus(d[0]) +
      d[2].join(""),
      16);
  }
%}

lit_bin_int -> "~":? ("0b" | "0B") [0-1]:+ {%
  function (d) {
    return parseInt(
      translateWeirdOzUnaryMinus(d[0]) +
      d[2].join(""),
      2);
  }
%}

##############################################################################
# Float
##############################################################################
lit_float -> "~":? [0-9]:+ "." [0-9]:* (("e" | "E") "~":? [0-9]:+):? {%
  function(d) {
    return litBuildNumber([parseFloat(
      translateWeirdOzUnaryMinus(d[0]) +
      d[1].join("") +
      "." +
      d[3].join("") +
      (d[4] ? "e" + (translateWeirdOzUnaryMinus(d[4][1]) + d[4][2].join("")) : "")
    )]);
  }
%}

##############################################################################
# List
##############################################################################

lit_list ->
    lit_empty_list {% id %}
  | lit_list_with_items {% id %}

lit_list_with_items -> "[" _ lit_list_items _ "]" {%
  function(d) {
    return d[2].reduce(
      function(a, b) {
        return litBuildRecord('|', {1: b, 2:a});
      },
      litBuildRecord("nil", {})
    );
  }
%}

lit_empty_list -> "[" _ "]" {%
  function(d) {
    return litBuildRecord("nil", {});
  }
%}

lit_list_items ->
    ids_identifier
  | lit_list_items __ ids_identifier {%
      function(d) {
        return d[0].concat(d[2]);
      }
    %}



##############################################################################
# Tuple
##############################################################################

lit_tuple -> lit_atom_syntax "(" _ lit_list_items _ ")" {%
  function(d, position, reject) {
    var label = d[0];
    var features = d[3].reduce(function(result, item, index) {
      result[++index] = item;
      return result;
    }, {});
    return litBuildRecord(label, features);
  }
%}

##############################################################################
# Procedures
##############################################################################
@{%
  function litBuildProcedure(args, body) {
    return {
      node: 'literal',
      type: 'procedure',
      value: { args: (args || []), body: body },
    };
  }
%}

lit_procedure -> "proc" _ "{" _ "$" lit_procedure_args:? _ "}" _  stm_sequence __ "end" {%
  function(d) {
    return litBuildProcedure(d[5], d[9]);
  }
%}

lit_procedure_args ->
    __ ids_identifier {% function(d) { return [d[1]] } %}
  | lit_procedure_args __ ids_identifier {%
    function(d) {
      return d[0].concat(d[2])
    }
  %}

##############################################################################
# LIB - UTILITIES
##############################################################################
# This section defines common rules, terminals and functions
##############################################################################

@{%
  function translateWeirdOzUnaryMinus(v) { return v === "~" ? "-" : "+"; }
%}

lib_pseudo_char ->
    lib_octal_char {% id %}
  | lib_hexal_char {% id %}
  | lib_escaped_char {% id %}

lib_octal_char -> "\\" ([0-7] [0-7] [0-7]) {%
  function (d, location, reject) {
    var value = parseInt(d[1].join(""), 8);
    if (value > 255) {
      return reject;
    } else {
      return String.fromCharCode(value);
    }
  }
%}

lib_hexal_char -> "\\" ("x" | "X") ([0-9a-fA-F] [0-9a-fA-F]) {%
  function (d) {
    return String.fromCharCode(parseInt(d[2].join(""), 16));
  }
%}

@{%
  var LIB_ESCAPED_CHARS = {
    "a": String.fromCharCode(7),
    "b": String.fromCharCode(8),
    "f": String.fromCharCode(12),
    "n": String.fromCharCode(10),
    "r": String.fromCharCode(13),
    "t": String.fromCharCode(9),
    "v": String.fromCharCode(11),
    "\\": String.fromCharCode(92),
    "'": String.fromCharCode(39),
    "\"": String.fromCharCode(34),
    "`": String.fromCharCode(96),
    "&": String.fromCharCode(38)
  }
%}

lib_escaped_char -> "\\" ("a" | "b" | "f" | "n" | "r" | "t" | "v" | "\\" | "'" | "\"" | "`" | "&") {%
  function (d) {
    return LIB_ESCAPED_CHARS[d[1]];
  }
%}

