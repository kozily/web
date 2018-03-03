@builtin "whitespace.ne"

##############################################################################
# LEXICAL SYNTAX
##############################################################################
# This section defines lexical nodes. These nodes are just a representation of
# a character sequence which has a given meaning, just as strings, variable
# identifiers and numbers; they don't have a semantic meaning on their own (you
# can't execute a variable identifier in any meaningful way, unless it's in the
# context of a unification, a declaration, etc.).
##############################################################################
lexical_index ->
    lexical_variable {% id %}
  | lexical_value {% id %}

lexical_value ->
    lexical_record {% id %}
  | lexical_atom {% id %}
  | lexical_boolean {% id %}
  | lexical_string {% id %}
  | lexical_char {% id %}
  | lexical_integer {% id %}
  | lexical_float {% id %}
  | lexical_list {% id %}
  | lexical_tuple {% id %}

##############################################################################
# Variable identifiers
##############################################################################
@{%
  function lexicalVariable(d) {
    return {
      node: 'variable',
      identifier: d[0],
    };
  }
%}

lexical_variable ->
    lexical_variable_syntax {% lexicalVariable %}

lexical_variable_syntax ->
    lexical_variable_unquoted {% id %}
  | lexical_variable_quoted {% id %}


lexical_variable_unquoted -> [A-Z] [A-Za-z0-9_]:* {%
  function(d) {
    return "" + d[0] + d[1].join("");
  }
%}

lexical_variable_quoted -> "`" ([^`\\] | lexical_lib_pseudo_char):* "`" {%
  function(d) {
    return d[1].join("");
  }
%}

##############################################################################
# Generic records
##############################################################################
@{%
  function lexicalRecord(label, features) {
    return { node: 'value', type: 'record', value: { label: label, features: features } };
  }
%}

lexical_record -> lexical_atom_syntax "(" _ lexical_record_feature_list _ ")" {%
  function(d, position, reject) {
    var label = d[0];
    var features = d[3].reduce(function(result, item) {
      result[item.name] = item.value;
      return result;
    }, {});
    return lexicalRecord(label, features);
  }
%}

lexical_record_feature_list ->
    lexical_record_feature_list __ lexical_record_feature {% function(d) { return d[0].concat(d[2]); } %}
  | lexical_record_feature

lexical_record_feature -> lexical_atom_syntax ":" lexical_variable {%
  function(d, position, reject) {
    return {name: d[0], value: d[2]};
  }
%}

##############################################################################
# Atoms
##############################################################################
@{%
  function lexicalAtom(d) {
    return lexicalRecord(d[0], {});
  }

  LEXICAL_KEYWORDS = [
    'andthen', 'at', 'attr', 'break', 'case', 'catch', 'choice', 'class',
    'collect', 'cond', 'continue', 'declare', 'default', 'define', 'dis', 'div',
    'do', 'else', 'elsecase', 'elseif', 'elseof', 'end', 'export', 'fail', 'false',
    'feat', 'finally', 'for', 'from', 'fun', 'functor', 'if', 'import', 'in',
    'lazy', 'local', 'lock', 'meth', 'mod', 'not', 'of', 'or', 'orelse', 'prepare',
    'proc', 'prop', 'raise', 'require', 'return', 'self', 'skip', 'then', 'thread',
    'true', 'try', 'unit',
  ];
%}

lexical_atom ->
    lexical_atom_syntax {% lexicalAtom %}

lexical_atom_syntax ->
    lexical_atom_unquoted {% id %}
  | lexical_atom_quoted {% id %}

lexical_atom_unquoted -> [a-z] [a-zA-Z0-9_]:* {%
  function(d, location, reject) {
    var name = "" + d[0] + d[1].join("");
    if (LEXICAL_KEYWORDS.indexOf(name) === -1) {
      return name;
    } else {
      return reject;
    }
  }
%}

lexical_atom_quoted -> "'" ([^'\\] | lexical_lib_pseudo_char):* "'" {%
  function(d) {
    return d[1].join("");
  }
%}

##############################################################################
# Booleans
##############################################################################
@{%
  function lexicalBoolean(d) {
    return lexicalRecord(d.toString(), {});
  }
%}

lexical_boolean ->
    lexical_boolean_syntax {% lexicalBoolean %}

lexical_boolean_syntax ->
    lexical_true_literal {% id %}
  | lexical_false_literal {% id %}

lexical_true_literal -> "true" {%
  function (d) {
    return true;
  }
%}

lexical_false_literal -> "false" {%
  function (d) {
    return false;
  }
%}

##############################################################################
# Strings
##############################################################################
@{%
  function lexicalString(d) {
    if (d[0] === "") {
      return lexicalRecord("nil", {});
    } else {
      return lexicalRecord("|", {
        1: d[0].charCodeAt(0),
        2: lexicalString([d[0].substring(1)]),
      });
    }
  }
%}

lexical_string ->
    lexical_string_syntax {% lexicalString %}

lexical_string_syntax -> "\"" ([^"\\] | lexical_lib_pseudo_char):* "\"" {%
  function(d) {
    return d[1].join("");
  }
%}

##############################################################################
# Generic numbers
##############################################################################
@{%
  function lexicalNumber(value) {
    return { node: 'value', type: 'number', value: value[0] };
  }
%}

##############################################################################
# Character
##############################################################################
lexical_char ->
    lexical_numeric_char {% lexicalNumber %}
  | lexical_quoted_char {% lexicalNumber %}
  | lexical_escaped_char {% lexicalNumber %}

lexical_numeric_char -> [1-9] [0-9]:* {%
  function(d, location, reject) {
    var value = parseInt("" + d[0] + d[1].join(""), 10);
    if (value > 255) {
      return reject;
    } else {
      return value;
    }
  }
%}

lexical_quoted_char -> "&" [^\\] {%
  function (d) {
    return d[1].charCodeAt(0);
  }
%}

lexical_escaped_char -> "&" lexical_lib_pseudo_char {%
  function(d) {
    return d[1].charCodeAt(0);
  }
%}

##############################################################################
# Integer
##############################################################################
lexical_integer ->
    lexical_decimal_int {% lexicalNumber %}
  | lexical_octal_int {% lexicalNumber %}
  | lexical_hexal_int {% lexicalNumber %}
  | lexical_bin_int {% lexicalNumber %}

lexical_decimal_int -> "~":? [1-9] [0-9]:* {%
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

lexical_octal_int -> "~":? "0" [0-7]:+ {%
  function (d) {
    return parseInt(
      translateWeirdOzUnaryMinus(d[0]) +
      d[2].join(""),
      8);
  }
%}

lexical_hexal_int -> "~":? ("0x" | "0X") [a-fA-F0-7]:+ {%
  function (d) {
    return parseInt(
      translateWeirdOzUnaryMinus(d[0]) +
      d[2].join(""),
      16);
  }
%}

lexical_bin_int -> "~":? ("0b" | "0B") [0-1]:+ {%
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
lexical_float -> "~":? [0-9]:+ "." [0-9]:* (("e" | "E") "~":? [0-9]:+):? {%
  function(d) {
    return lexicalNumber([parseFloat(
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

lexical_list ->
    empty_list {% id %}
  | normal_list {% id %}

normal_list -> "[" _ list_items _ "]" {%
  function(d) {
    return d[2].reduce(
      function(a, b) {
        return lexicalRecord('|', {1: b, 2:a});
      },
      lexicalRecord("nil", {})
    );
  }
%}

empty_list -> "[" _ "]" {%
  function(d) {
    return lexicalRecord("nil", {});
  }
%}

list_items ->
    lexical_variable
  | list_items __ lexical_variable {%
      function(d) {
        return d[0].concat(d[2]);
      }
    %}



##############################################################################
# Tuple
##############################################################################

lexical_tuple -> lexical_atom_syntax "(" _ list_items _ ")" {%
  function(d, position, reject) {
    var label = d[0];
    var features = d[3].reduce(function(result, item, index) {
      result[++index] = item;
      return result;
    }, {});
    return lexicalRecord(label, features);
  }
%}

##############################################################################
# Library of helpful terminals and functions
##############################################################################
@{%
  function translateWeirdOzUnaryMinus(v) { return v === "~" ? "-" : "+"; }
%}

lexical_lib_pseudo_char ->
    lexical_lib_octal_char {% id %}
  | lexical_lib_hexal_char {% id %}
  | lexical_lib_escaped_char {% id %}

lexical_lib_octal_char -> "\\" ([0-7] [0-7] [0-7]) {%
  function (d, location, reject) {
    var value = parseInt(d[1].join(""), 8);
    if (value > 255) {
      return reject;
    } else {
      return String.fromCharCode(value);
    }
  }
%}

lexical_lib_hexal_char -> "\\" ("x" | "X") ([0-9a-fA-F] [0-9a-fA-F]) {%
  function (d) {
    return String.fromCharCode(parseInt(d[2].join(""), 16));
  }
%}

@{%
  var LEXICAL_ESCAPEDCHARS = {
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

lexical_lib_escaped_char -> "\\" ("a" | "b" | "f" | "n" | "r" | "t" | "v" | "\\" | "'" | "\"" | "`" | "&") {%
  function (d) {
    return LEXICAL_ESCAPEDCHARS[d[1]];
  }
%}

