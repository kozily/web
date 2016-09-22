##############################################################################
# 1 Literals
##############################################################################
@{%
  function makeLiteral(type, value) { return { node: 'literal', type: type, value: value }; }
%}

##############################################################################
# 1.1 Numbers
##############################################################################

@{%
  function translateWeirdOzUnaryMinus(v) { return v === "~" ? "-" : "+"; }
  function makeNumberLiteral(value) { return makeLiteral('number', value); }
%}

number ->
    integer {% id %}
  | float {% id %}
  | char {% id %}

##############################################################################
# 1.1.1 Integers
##############################################################################

integer ->
    decimal_int {% id %}
  | octal_int {% id %}
  | hexal_int {% id %}
  | bin_int {% id %}

decimal_int -> "~":? [1-9] [0-9]:* {%
  function (d) {
    return makeNumberLiteral(parseInt(
      translateWeirdOzUnaryMinus(d[0]) +
      d[1] +
      d[2].join(""),
      10));
  }
%}

octal_int -> "~":? "0" [0-7]:+ {%
  function (d) {
    return makeNumberLiteral(parseInt(
      translateWeirdOzUnaryMinus(d[0]) +
      d[2].join(""),
      8));
  }
%}

hexal_int -> "~":? ("0x" | "0X") [a-fA-F0-7]:+ {%
  function (d) {
    return makeNumberLiteral(parseInt(
      translateWeirdOzUnaryMinus(d[0]) +
      d[2].join(""),
      16));
  }
%}

bin_int -> "~":? ("0b" | "0B") [0-1]:+ {%
  function (d) {
    return makeNumberLiteral(parseInt(
      translateWeirdOzUnaryMinus(d[0]) +
      d[2].join(""),
      2));
  }
%}

##############################################################################
# 1.1.2 Floats
##############################################################################

float -> "~":? [0-9]:+ "." [0-9]:* (("e" | "E") "~":? [0-9]:+):? {%
  function(d) {
    return makeNumberLiteral(parseFloat(
      translateWeirdOzUnaryMinus(d[0]) +
      d[1].join("") +
      "." +
      d[3].join("") +
      (d[4] ? "e" + (translateWeirdOzUnaryMinus(d[4][1]) + d[4][2].join("")) : "")
    ));
  }
%}

##############################################################################
# 1.1.3 Chars
##############################################################################

char ->
    quoted_char {% id %}
    | octal_char {% id %}
    | hexal_char {% id %}
    | escaped_char {% id %}

quoted_char -> "&" [^\\] {%
  function (d) {
    return makeNumberLiteral(d[1].charCodeAt(0));
  }
%}

octal_char -> "&" "\" ([0-7][0-7][0-7]):+ {%
  function (d) {
    return makeNumberLiteral(parseInt(
      d[2].join(""), 8
    ));
  }
%}

hexal_char -> "&" "\" ("x" | "X") ([0-9a-fA-F][0-9a-fA-F]) {%
  function (d) {
    return makeNumberLiteral(parseInt(
      d[3].join(""), 16
    ));
  }
%}

@{%
  var escapedChars = {
    "a": 7, "b": 8, "f": 12, "n": 10, "r": 13, "t": 9, "v": 11, "\": 92, "’": 39, "\"": 34, "`': 96, "&": 38
  }
%}

escaped_char -> "&" "\" ("a" | "b" | "f" | "n" | "r" | "t" | "v" | "\" | "’" | "\"" | "`" | "&") {%
  function (d) {
    return makeNumberLiteral(escapedChars[d[2]);
  }
%}
