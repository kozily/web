@{%
  function translateWeirdOzUnaryMinus(v) { return v === "~" ? "-" : "+"; }
  function makeLiteral(type, value) { return { node: 'literal', type: type, value: value }; }
  function makeNumberLiteral(value) { return makeLiteral('number', value); }
%}

number ->
    integer {% id %}
  | float {% id %}

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
