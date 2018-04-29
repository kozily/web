@builtin "whitespace.ne"
@builtin "postprocessors.ne"

##############################################################################
# Utilities and functions
##############################################################################

@{%
  STM_SPECIAL_PROCEDURES = [
    "ByNeed",
    "NewCell",
    "NewPort",
    "Send",
  ];

  LIT_KEYWORDS = [
    "andthen", "at", "attr", "break", "case", "catch", "choice", "class",
    "collect", "cond", "continue", "declare", "default", "define", "dis", "div",
    "do", "else", "elsecase", "elseif", "elseof", "end", "export", "fail", "false",
    "feat", "finally", "for", "from", "fun", "functor", "if", "import", "in",
    "lazy", "local", "lock", "meth", "mod", "not", "of", "or", "orelse", "prepare",
    "proc", "prop", "raise", "require", "return", "self", "skip", "then", "thread",
    "true", "try", "unit",
  ];

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
  };

  function logActivation(name, f) {
    return function() {
      console.log("Activating rule", name, "with arguments", JSON.stringify(arguments, null, 2));
      return f.apply(null, arguments);
    };
  }

  function expBuildExpressionWrapper(index, type) {
    return function(d) {
      var result =  {
        node: "expression",
        type: type,
      };
      result[type] = d[index];
      return result;
    };
  };

  function expBuildOperatorExpression(lhsIndex, rhsIndex, operatorIndices) {
    return function(d) {
      var lhs = d[lhsIndex];
      var rhs = d[rhsIndex]
      var operator = operatorIndices.reduce(function (result, index) { return result[index]; }, d);

      return {
        node: "expression",
        type: "operator",
        operator: operator,
        lhs: lhs,
        rhs: rhs,
      };
    };
  }

  function idsBuildIdentifier(d) {
    return {
      node: "identifier",
      identifier: d[0],
    };
  }

  function litBuildRecord(label, features) {
    return { node: "literal", type: "record", value: { label: label, features: features } };
  }

  function litBuildAtom(d) {
    return litBuildRecord(d[0], {});
  }

  function litBuildBoolean(d) {
    return litBuildRecord(d.toString(), {});
  }

  function litBuildListItem(head, tail) {
    return litBuildRecord("|", {
      1: head,
      2: tail,
    });
  }

  function litBuildList(items) {
    return items.reduceRight(function(result, item) {
      return litBuildListItem(item, result);
    }, litBuildRecord("nil", {}));
  }

  function litBuildString(d) {
    return litBuildList(d[0].split("").map(function(s) {
      return litBuildNumber([s.charCodeAt(0)])
    }));
  }

  function litBuildNumber(value) {
    return { node: "literal", type: "number", value: value[0] };
  }

  function litBuildProcedure(args, body) {
    return {
      node: "literal",
      type: "procedure",
      value: { args: (args || []), body: body },
    };
  }

  function translateWeirdOzUnaryMinus(v) { return v === "~" ? "-" : "+"; }
%}

##############################################################################
# STM - STATEMENTS
##############################################################################
stm_root -> _ stm_sequence _ {% nth(1) %}

stm_sequence ->
    stm_simple __ stm_sequence {%
      function (d) {
        return {
          node: "statement",
          type: "sequenceSyntax",
          head: d[0],
          tail: d[2]
        };
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
  | stm_thread {% id %}
  | stm_by_need {% id %}
  | stm_cell_creation {% id %}
  | stm_port_creation {% id %}
  | stm_port_send {% id %}

stm_skip -> "skip" {%
  function (d) {
    return {
      node: "statement",
      type: "skipSyntax"
    };
  }
%}

stm_local -> "local" __ stm_local_identifier_list __ "in" __ stm_sequence __ "end" {%
  function(d) {
    return {
      node: "statement",
      type: "localSyntax",
      identifiers: d[2],
      statement: d[6],
    };
  }
%}

stm_local_identifier_list ->
    ids_identifier
  | stm_local_identifier_list __ ids_identifier {%
    function(d) {
      return d[0].concat(d[2]);
    }
  %}

stm_binding -> ids_identifier _ "=" _ ids_identifier {%
  function(d, position, reject) {
    return {
      node: "statement",
      type: "bindingSyntax",
      lhs: d[0],
      rhs: d[4],
    };
  }
%}

stm_value_creation -> ids_identifier _ "=" _ exp_expression {%
  function(d, position, reject) {
    if (d[4].type === "identifier") {
      return reject;
    }
    return {
      node: "statement",
      type: "valueCreationSyntax",
      lhs: d[0],
      rhs: d[4],
    };
  }
%}

stm_conditional -> "if" __ exp_expression __ "then" __ stm_sequence __ ("else" __ stm_sequence __):? "end" {%
  function(d, position, reject) {
    return {
      node: "statement",
      type: "conditionalSyntax",
      condition: d[2],
      trueStatement: d[6],
      falseStatement: d[8] ? d[8][2] : undefined,
    }
  }
%}

stm_pattern_matching -> "case" __ exp_expression __ "of" __ pat_pattern __ "then" __ stm_sequence __ ("[]" __ pat_pattern __ "then" __ stm_sequence __ ):* ("else" __ stm_sequence __):? "end" {%
  function(d, position, reject) {
    const clauses = d[12].reduce(function(result, clause) {
      result.push({
        pattern: clause[2],
        statement: clause[6],
      });
      return result;
    }, [{pattern: d[6], statement: d[10]}]);

    return {
      node: "statement",
      type: "patternMatchingSyntax",
      identifier: d[2],
      clauses: clauses,
      falseStatement: d[13] ? d[13][2] : undefined,
    }
  }
%}

stm_procedure_application -> "{" _ exp_expression stm_procedure_application_args:? _ "}" {%
  function(d, position, reject) {
    var procedure = d[2];
    if (procedure.type === "identifier" && STM_SPECIAL_PROCEDURES.indexOf(procedure.identifier.identifier) !== -1) {
      return reject;
    } else {
      return {
        node: "statement",
        type: "procedureApplicationSyntax",
        procedure: d[2],
        args: d[3] || [],
      };
    }
  }
%}

stm_procedure_application_args ->
    __ exp_expression {% function(d) { return [d[1]] } %}
  | stm_procedure_application_args __ exp_expression {%
    function(d) {
      return d[0].concat(d[2])
    }
  %}

stm_try -> "try" __ stm_sequence __ "catch" __ ids_identifier __ "then" __ stm_sequence __ "end" {%
  function(d) {
    return {
      node: "statement",
      type: "exceptionContextSyntax",
      triedStatement: d[2],
      exceptionIdentifier: d[6],
      exceptionStatement: d[10],
    };
  }
%}

stm_raise -> "raise" __ exp_expression __ "end" {%
  function(d) {
    return {
      node: "statement",
      type: "exceptionRaiseSyntax",
      identifier: d[2],
    };
  }
%}

stm_thread -> "thread" __ stm_sequence __ "end" {%
  function(d, position, reject) {
    return {
      node: "statement",
      type: "threadSyntax",
      body: d[2],
    };
  }
%}

stm_by_need -> "{" _ "ByNeed" __ exp_expression __ ids_identifier _ "}" {%
  function(d, position, reject) {
    return {
      node: "statement",
      type: "byNeedSyntax",
      procedure: d[4],
      neededIdentifier: d[6],
    };
  }
%}

stm_cell_creation -> "{" _ "NewCell" __ exp_expression __ ids_identifier _ "}" {%
  function(d) {
    return {
      node: "statement",
      type: "cellCreationSyntax",
      value: d[4],
      cell: d[6],
    };
  }
%}

stm_port_creation -> "{" _ "NewPort" __ ids_identifier __ ids_identifier _ "}" {%
  function(d) {
    return {
      node: "statement",
      type: "portCreationSyntax",
      value: d[4],
      port: d[6],
    };
  }
%}

stm_port_send -> "{" _ "Send" __ exp_expression __ exp_expression _ "}" {%
  function(d) {
    return {
      node: "statement",
      type: "portSendSyntax",
      port: d[4],
      value: d[6],
    };
  }
%}

##############################################################################
# EXP - EXPRESSIONS
##############################################################################
exp_expression ->
    exp_comparison {% id %}

exp_comparison ->
    exp_sum {% id %}
  | exp_comparison_term {% id %}

exp_comparison_term -> exp_sum _ ("=="|"\\="|"<"|"<="|">"|">=") _ exp_sum {% expBuildOperatorExpression(0, 4, [2, 0]) %}

exp_sum ->
    exp_product {% id %}
  | exp_sum_term {% id %}

exp_sum_term -> exp_sum _ ("+"|"-") _ exp_product {% expBuildOperatorExpression(0, 4, [2, 0]) %}

exp_product ->
    exp_feature_selection {% id %}
  | exp_product_term {% id %}

exp_product_term -> exp_product _ ("*"|"div"|"mod"|"/") _ exp_feature_selection {% expBuildOperatorExpression(0, 4, [2, 0]) %}

exp_feature_selection ->
    exp_terminal {% id %}
  | exp_feature_selection_term {% id %}

exp_feature_selection_term -> exp_feature_selection "." exp_feature_selection_rhs {% expBuildOperatorExpression(0, 2, [1]) %}

exp_feature_selection_rhs ->
    exp_terminal_identifier {% id %}
  | lit_atom {% expBuildExpressionWrapper(0, "literal") %}
  | exp_feature_selection_tuple_integers {% expBuildExpressionWrapper(0, "literal") %}
  | exp_terminal_paren {% id %}

exp_feature_selection_tuple_integers -> [1-9] [0-9]:* {%
  function(d) {
    var concatenated = "" + d[0] + d[1].join("");
    var value = parseInt(concatenated, 10);
    return litBuildNumber([value]);
  }
%}

exp_terminal ->
    exp_terminal_identifier {% id %}
  | exp_terminal_literal {% id %}
  | exp_terminal_paren {% id %}

exp_terminal_identifier -> ids_identifier {% expBuildExpressionWrapper(0, "identifier") %}

exp_terminal_literal -> lit_value {% expBuildExpressionWrapper(0, "literal") %}

exp_terminal_paren -> "(" _ exp_expression _ ")" {% nth(2) %}

##############################################################################
# IDS - IDENTIFIERS
##############################################################################
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

lit_record_feature -> lit_atom_syntax ":" lit_record_value {%
  function(d, position, reject) {
    return {name: d[0], value: d[2]};
  }
%}

lit_record_value -> (ids_identifier|lit_value) {%
  function(d) {
    return d[0][0];
  }
%}

##############################################################################
# Atoms
##############################################################################
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
# List
##############################################################################
lit_list ->
    lit_empty_list {% id %}
  | lit_list_with_items {% id %}
  | lit_cons_list {% id %}

lit_list_with_items -> "[" _ lit_list_items _ "]" {%
  function(d) {
    return litBuildList(d[2]);
  }
%}

lit_empty_list -> "[" _ "]" {%
  function(d) {
    return litBuildList([]);
  }
%}

lit_list_items ->
    lit_list_item
  | lit_list_items __ lit_list_item {%
      function(d) {
        return d[0].concat(d[2]);
      }
    %}

lit_list_item -> (ids_identifier | lit_value) {%
  function(d) {
    return d[0][0];
  }
%}

lit_cons_list -> lit_list_item "|" (lit_list | ids_identifier) {%
  function(d) {
    return litBuildListItem(
      d[0],
      d[2][0]
    );
  }
%}

##############################################################################
# Strings
##############################################################################
lit_string ->
    lit_string_syntax {% litBuildString %}

lit_string_syntax -> "\"" ([^"\\] | lib_pseudo_char):* "\"" {%
  function(d) {
    return d[1].join("");
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
# Procedures
##############################################################################
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
# PAT - PATTERNS
##############################################################################
 pat_pattern ->
    lit_record {% id %}
  | lit_atom {% id %}
  | lit_boolean {% id %}
  | lit_tuple {% id %}
  | lit_list {% id %}


##############################################################################
# LIB - UTILITIES
##############################################################################
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

lib_escaped_char -> "\\" ("a" | "b" | "f" | "n" | "r" | "t" | "v" | "\\" | "'" | "\"" | "`" | "&") {%
  function (d) {
    return LIB_ESCAPED_CHARS[d[1]];
  }
%}

