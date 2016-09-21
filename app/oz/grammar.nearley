@{%
  function makeLiteral(type, value) { return { node: 'literal', type: type, value: value }; }
  function makeNumberLiteral(value) { return makeLiteral('number', value); }
%}

number ->
    integer {% id %}

integer ->
    decimal_int {% id %}
  | octal_int {% id %}
  | hexal_int {% id %}
  | bin_int {% id %}

decimal_int -> "~":? [1-9] [0-9]:* {%
  function (d) {
    var sign = d[0] ? -1 : 1;
    var value = sign * parseInt("" + d[1] + d[2].join(""), 10);
    return makeNumberLiteral(value);
  }
%}

octal_int -> "~":? "0" [0-7]:+ {%
  function (d) {
    var sign = d[0] ? -1 : 1;
    var value = sign * parseInt(d[2].join(""), 8);
    return makeNumberLiteral(value);
  }
%}

hexal_int -> "~":? ("0x" | "0X") [a-fA-F0-7]:+ {%
  function (d) {
    var sign = d[0] ? -1 : 1;
    var value = sign * parseInt(d[2].join(""), 16);
    return makeNumberLiteral(value);
  }
%}

bin_int -> "~":? ("0b" | "0B") [0-1]:+ {%
  function (d) {
    var sign = d[0] ? -1 : 1;
    var value = sign * parseInt(d[2].join(""), 2);
    return makeNumberLiteral(value);
  }
%}

