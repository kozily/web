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
      variable: d[2],
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

stm_value_creation -> ids_identifier _ "=" _ val_value {%
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

stm_pattern_matching -> "case" __ ids_identifier __ "of" __ val_record_like __ "then" __ stm_sequence __ "else" __ stm_sequence __ "end" {%
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

##############################################################################
# IDS - IDENTIFIERS
##############################################################################
# This section defines parsing rules for standalone identifiers
##############################################################################
@{%
  function idsBuildIdentifier(d) {
    return {
      node: 'variable',
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
# VAL - VALUES
##############################################################################
# This section defines parsing rules for value literals, such as records, atoms
# and booleans.
##############################################################################

val_value ->
    val_record {% id %}
  | val_atom {% id %}
  | val_boolean {% id %}
  | val_string {% id %}
  | val_char {% id %}
  | val_integer {% id %}
  | val_float {% id %}
  | val_list {% id %}
  | val_tuple {% id %}

##############################################################################
# Records
##############################################################################
@{%
  function valBuildRecord(label, features) {
    return { node: 'value', type: 'record', value: { label: label, features: features } };
  }
%}

val_record -> val_atom_syntax "(" _ val_record_feature_list _ ")" {%
  function(d, position, reject) {
    var label = d[0];
    var features = d[3].reduce(function(result, item) {
      result[item.name] = item.value;
      return result;
    }, {});
    return valBuildRecord(label, features);
  }
%}

val_record_feature_list ->
    val_record_feature_list __ val_record_feature {% function(d) { return d[0].concat(d[2]); } %}
  | val_record_feature

val_record_feature -> val_atom_syntax ":" ids_identifier {%
  function(d, position, reject) {
    return {name: d[0], value: d[2]};
  }
%}

##############################################################################
# Atoms
##############################################################################
@{%
  function valBuildAtom(d) {
    return valBuildRecord(d[0], {});
  }

  VAL_KEYWORDS = [
    'andthen', 'at', 'attr', 'break', 'case', 'catch', 'choice', 'class',
    'collect', 'cond', 'continue', 'declare', 'default', 'define', 'dis', 'div',
    'do', 'else', 'elsecase', 'elseif', 'elseof', 'end', 'export', 'fail', 'false',
    'feat', 'finally', 'for', 'from', 'fun', 'functor', 'if', 'import', 'in',
    'lazy', 'local', 'lock', 'meth', 'mod', 'not', 'of', 'or', 'orelse', 'prepare',
    'proc', 'prop', 'raise', 'require', 'return', 'self', 'skip', 'then', 'thread',
    'true', 'try', 'unit',
  ];
%}

val_atom ->
    val_atom_syntax {% valBuildAtom %}

val_atom_syntax ->
    val_atom_unquoted {% id %}
  | val_atom_quoted {% id %}

val_atom_unquoted -> [a-z] [a-zA-Z0-9_]:* {%
  function(d, location, reject) {
    var name = "" + d[0] + d[1].join("");
    if (VAL_KEYWORDS.indexOf(name) === -1) {
      return name;
    } else {
      return reject;
    }
  }
%}

val_atom_quoted -> "'" ([^'\\] | lib_pseudo_char):* "'" {%
  function(d) {
    return d[1].join("");
  }
%}

##############################################################################
# Booleans
##############################################################################
@{%
  function valBuildBoolean(d) {
    return valBuildRecord(d.toString(), {});
  }
%}

val_boolean ->
    val_boolean_syntax {% valBuildBoolean %}

val_boolean_syntax ->
    val_true_literal {% id %}
  | val_false_literal {% id %}

val_true_literal -> "true" {%
  function (d) {
    return true;
  }
%}

val_false_literal -> "false" {%
  function (d) {
    return false;
  }
%}

##############################################################################
# Record-like items
##############################################################################
val_record_like ->
    val_record {% id %}
  | val_atom {% id %}
  | val_boolean {% id %}

##############################################################################
# Strings
##############################################################################
@{%
  function valBuildString(d) {
    if (d[0] === "") {
      return valBuildRecord("nil", {});
    } else {
      return valBuildRecord("|", {
        1: d[0].charCodeAt(0),
        2: valBuildString([d[0].substring(1)]),
      });
    }
  }
%}

val_string ->
    val_string_syntax {% valBuildString %}

val_string_syntax -> "\"" ([^"\\] | lib_pseudo_char):* "\"" {%
  function(d) {
    return d[1].join("");
  }
%}

##############################################################################
# Generic numbers
##############################################################################
@{%
  function valBuildNumber(value) {
    return { node: 'value', type: 'number', value: value[0] };
  }
%}

##############################################################################
# Character
##############################################################################
val_char ->
    val_numeric_char {% valBuildNumber %}
  | val_quoted_char {% valBuildNumber %}
  | val_escaped_char {% valBuildNumber %}

val_numeric_char -> [1-9] [0-9]:* {%
  function(d, location, reject) {
    var value = parseInt("" + d[0] + d[1].join(""), 10);
    if (value > 255) {
      return reject;
    } else {
      return value;
    }
  }
%}

val_quoted_char -> "&" [^\\] {%
  function (d) {
    return d[1].charCodeAt(0);
  }
%}

val_escaped_char -> "&" lib_pseudo_char {%
  function(d) {
    return d[1].charCodeAt(0);
  }
%}

##############################################################################
# Integer
##############################################################################
val_integer ->
    val_decimal_int {% valBuildNumber %}
  | val_octal_int {% valBuildNumber %}
  | val_hexal_int {% valBuildNumber %}
  | val_bin_int {% valBuildNumber %}

val_decimal_int -> "~":? [1-9] [0-9]:* {%
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

val_octal_int -> "~":? "0" [0-7]:+ {%
  function (d) {
    return parseInt(
      translateWeirdOzUnaryMinus(d[0]) +
      d[2].join(""),
      8);
  }
%}

val_hexal_int -> "~":? ("0x" | "0X") [a-fA-F0-7]:+ {%
  function (d) {
    return parseInt(
      translateWeirdOzUnaryMinus(d[0]) +
      d[2].join(""),
      16);
  }
%}

val_bin_int -> "~":? ("0b" | "0B") [0-1]:+ {%
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
val_float -> "~":? [0-9]:+ "." [0-9]:* (("e" | "E") "~":? [0-9]:+):? {%
  function(d) {
    return valBuildNumber([parseFloat(
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

val_list ->
    val_empty_list {% id %}
  | val_list_with_items {% id %}

val_list_with_items -> "[" _ val_list_items _ "]" {%
  function(d) {
    return d[2].reduce(
      function(a, b) {
        return valBuildRecord('|', {1: b, 2:a});
      },
      valBuildRecord("nil", {})
    );
  }
%}

val_empty_list -> "[" _ "]" {%
  function(d) {
    return valBuildRecord("nil", {});
  }
%}

val_list_items ->
    ids_identifier
  | val_list_items __ ids_identifier {%
      function(d) {
        return d[0].concat(d[2]);
      }
    %}



##############################################################################
# Tuple
##############################################################################

val_tuple -> val_atom_syntax "(" _ val_list_items _ ")" {%
  function(d, position, reject) {
    var label = d[0];
    var features = d[3].reduce(function(result, item, index) {
      result[++index] = item;
      return result;
    }, {});
    return valBuildRecord(label, features);
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

