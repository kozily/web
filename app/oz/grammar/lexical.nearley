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
  | lexical_atom {% id %}
  | lexical_boolean {% id %}
  | lexical_string {% id %}
  | lexical_char {% id %}
  | lexical_integer {% id %}
  | lexical_float {% id %}

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
    lexical_variable_unquoted {% lexicalVariable %}
  | lexical_variable_quoted {% lexicalVariable %}

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
    lexical_atom_unquoted {% lexicalAtom %}
  | lexical_atom_quoted {% lexicalAtom %}

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
    lexical_true_literal {% lexicalBoolean %}
  | lexical_false_literal {% lexicalBoolean %}

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

lexical_string -> "\"" ([^"\\] | lexical_lib_pseudo_char):* "\"" {%
  function(d) {
    return lexicalString([d[1].join("")]);
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

