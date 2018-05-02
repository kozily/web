@builtin "postprocessors.ne"

##############################################################################
# Utilities and functions
##############################################################################

@{%
  STM_SPECIAL_PROCEDURES = [
    "ByNeed",
    "NewCell",
    "Exchange",
    "NewPort",
    "Send",
    "NewName",
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

  function expWrap(type) {
    return function(d) {
      var result =  {
        node: "expression",
        type: type,
      };
      result[type] = d;
      return result;
    };
  }

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

  function expBuildFunctionExpression(fun, args) {
    return {
      node: "expression",
      type: "function",
      fun: fun,
      args: args,
    };
  }

  function idsBuildIdentifier(d) {
    return {
      node: "identifier",
      identifier: d[1],
    };
  }

  function anyBuildIdentifier(d) {
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

  function litBuildList(items, wrap) {
    if (!wrap) {
      wrap = function(x) { return x; };
    }
    return items.reduceRight(function(result, item) {
      return wrap(litBuildListItem(item, result));
    }, wrap(litBuildRecord("nil", {})));
  }

  function litBuildString(value, wrap) {
    if (!wrap) {
      wrap = function(x) { return x; };
    }
    var numbers = value.split("").map(function(s) {
      return wrap(litBuildNumber([s.charCodeAt(0)]))
    });
    return litBuildList(numbers, wrap);
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

  function litBuildFunction(args, expression, statement) {
    return {
      node: "literal",
      type: "function",
      value: {
        args: (args || []),
        expression: expression,
        statement: statement,
      },
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
  | stm_conditional {% id %}
  | stm_pattern_matching {% id %}
  | stm_procedure_application {% id %}
  | stm_procedure_declaration {% id %}
  | stm_function_declaration {% id %}
  | stm_try {% id %}
  | stm_raise {% id %}
  | stm_thread {% id %}
  | stm_by_need {% id %}
  | stm_cell_creation {% id %}
  | stm_cell_exchange {% id %}
  | stm_port_creation {% id %}
  | stm_port_send {% id %}
  | stm_name_creation {% id %}

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

stm_binding -> exp_expression _ "=" _ exp_expression {%
  function(d, position, reject) {
    return {
      node: "statement",
      type: "bindingSyntax",
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
    }
    return {
      node: "statement",
      type: "procedureApplicationSyntax",
      procedure: d[2],
      args: d[3] || [],
    };
  }
%}

stm_procedure_declaration -> "proc" _ "{" _ ids_identifier lit_procedure_args:? _ "}" _  stm_sequence __ "end" {%
  function(d) {
    var lhs = expBuildExpressionWrapper(0, "identifier")([d[4]]);

    var args = d[5];
    var body = d[9];
    var procedure = litBuildProcedure(args, body);

    var rhs = expBuildExpressionWrapper(0, "literal")([procedure]);

    return {
      node: "statement",
      type: "bindingSyntax",
      lhs: lhs,
      rhs: rhs,
    };
  }
%}

stm_function_declaration -> "fun" _ "{" _ ids_identifier lit_function_args:? _ "}" __  (stm_sequence __):? exp_expression __ "end" {%
  function(d) {
    var lhs = expBuildExpressionWrapper(0, "identifier")([d[4]]);

    var args = d[5];
    var statement = d[9] ? d[9][0] : undefined;
    var expression = d[10];
    var fun = litBuildFunction(args, expression, statement);

    var rhs = expBuildExpressionWrapper(0, "literal")([fun]);

    return {
      node: "statement",
      type: "bindingSyntax",
      lhs: lhs,
      rhs: rhs,
    };
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

stm_cell_creation -> "{" _ "NewCell" __ exp_expression __ exp_expression _ "}" {%
  function(d) {
    return {
      node: "statement",
      type: "cellCreationSyntax",
      value: d[4],
      cell: d[6],
    };
  }
%}

stm_cell_exchange -> "{" _ "Exchange" __ exp_expression __ ids_identifier __ exp_expression _ "}" {%
  function(d) {
    return {
      node: "statement",
      type: "cellExchangeSyntax",
      cell: d[4],
      current: d[6],
      next: d[8],
    };
  }
%}

stm_port_creation -> "{" _ "NewPort" __ ids_identifier __ exp_expression _ "}" {%
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

stm_name_creation-> "{" _ "NewName" __ exp_expression _ "}" {%
  function(d) {
    return {
      node: "statement",
      type: "nameCreationSyntax",
      name: d[4],
    };
  }
%}

##############################################################################
# EXP - EXPRESSIONS
##############################################################################
exp_expression ->
    exp_comparison {% id %}

exp_comparison ->
    exp_cons {% id %}
  | exp_comparison_term {% id %}

exp_comparison_term -> exp_cons _ ("=="|"\\="|"<"|"<="|">"|">=") _ exp_cons {% expBuildOperatorExpression(0, 4, [2, 0]) %}

exp_cons ->
    exp_sum {% id %}
  | exp_cons_list_term {% expBuildExpressionWrapper(0, "literal") %}
  | exp_cons_tuple_term {% expBuildExpressionWrapper(0, "literal") %}

exp_cons_list_term -> exp_sum _ "|" _ exp_cons {%
  function(d) {
    return litBuildRecord("|", {
      1: d[0],
      2: d[4],
    });
  }
%}

exp_cons_tuple_term -> exp_sum _ ("#" _ exp_sum _):+ {%
  function(d) {
    var label = "#";
    var featureList = [d[0]].concat(d[2].map(function(item) {
      return item[2];
    }));
    var features = featureList.reduce(function(result, item, index) {
      result[++index] = item;
      return result;
    }, {});

    return litBuildRecord(label, features);
  }
%}

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

exp_feature_selection_term -> exp_feature_selection_lhs "." exp_feature_selection_rhs {% expBuildOperatorExpression(0, 2, [1]) %}

exp_feature_selection_lhs ->
    exp_terminal_no_literals {% id %}
  | exp_feature_selection_term {% id %}

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

exp_terminal_no_literals ->
    exp_terminal_identifier {% id %}
  | exp_terminal_record {% expBuildExpressionWrapper(0, "literal") %}
  | exp_terminal_tuple {% expBuildExpressionWrapper(0, "literal") %}
  | exp_terminal_list {% id %}
  | exp_terminal_paren {% id %}
  | exp_terminal_function {% id %}
  | exp_terminal_local {% id %}
  | exp_terminal_conditional {% id %}
  | exp_terminal_try {% id %}
  | exp_terminal_pattern_matching {% id %}
  | exp_terminal_thread {% id %}
  | exp_terminal_name_creation {% id %}
  | exp_terminal_cell_creation {% id %}
  | exp_terminal_port_creation {% id %}
  | exp_at_cell {% id %}
  | exp_colon_equals_cell {% id %}

exp_terminal ->
    exp_terminal_no_literals {% id %}
  | exp_terminal_literal {% id %}
  | exp_terminal_string {% id %}

exp_terminal_record -> lit_atom_syntax "(" _ exp_terminal_record_feature_list _ ")" {%
  function(d, position, reject) {
    var label = d[0];
    var features = d[3].reduce(function(result, item) {
      result[item.name] = item.value;
      return result;
    }, {});
    return litBuildRecord(label, features);
  }
%}

exp_terminal_record_feature_list ->
    exp_terminal_record_feature_list __ exp_terminal_record_feature {% function(d) { return d[0].concat(d[2]); } %}
  | exp_terminal_record_feature

exp_terminal_record_feature -> lit_atom_syntax ":" exp_expression {%
  function(d, position, reject) {
    return {name: d[0], value: d[2]};
  }
%}

exp_terminal_tuple -> lit_atom_syntax "(" _ exp_terminal_list_items _ ")" {%
  function(d, position, reject) {
    var label = d[0];
    var features = d[3].reduce(function(result, item, index) {
      result[++index] = item;
      return result;
    }, {});
    return litBuildRecord(label, features);
  }
%}

exp_terminal_list ->
    exp_terminal_empty_list {% id %}
  | exp_terminal_list_with_items {% id %}

exp_terminal_list_with_items -> "[" _ exp_terminal_list_items _ "]" {%
  function(d) {
    return litBuildList(d[2], expWrap("literal"));
  }
%}

exp_terminal_empty_list -> "[" _ "]" {%
  function(d) {
    return litBuildList([], expWrap("literal"));
  }
%}

exp_terminal_list_items ->
    exp_expression
  | exp_terminal_list_items __ exp_expression {%
      function(d) {
        return d[0].concat(d[2]);
      }
    %}

exp_terminal_identifier -> ids_identifier {% expBuildExpressionWrapper(0, "identifier") %}

exp_terminal_literal -> lit_value {% expBuildExpressionWrapper(0, "literal") %}

exp_terminal_string -> lit_string_syntax {%
  function(d) {
    return litBuildString(d[0], expWrap("literal"));
  }
%}

exp_at_cell -> "@" exp_expression {%
  function(d) {
    return {
      node: "expression",
      type: "atCell",
      cell: d[1]
    };
  }
%}

exp_colon_equals_cell -> exp_expression _ ":=" _ exp_expression {% expBuildOperatorExpression(0, 4, [2]) %}

exp_terminal_paren -> "(" _ exp_expression _ ")" {% nth(2) %}

exp_terminal_function -> "{" _ exp_expression (__ exp_expression):* _ "}" {%
  function(d, position, reject) {
    var functionExpression = d[2];
    if (functionExpression.type === "identifier" && STM_SPECIAL_PROCEDURES.indexOf(functionExpression.identifier.identifier) !== -1) {
      return reject;
    }
    var functionArguments = d[3].map(function(arg) {
      return arg[1];
    });

    return expBuildFunctionExpression(functionExpression, functionArguments);
  }
%}

exp_terminal_local -> "local" __ stm_local_identifier_list __ "in" __ (stm_sequence __):? exp_expression __ "end" {%
  function(d) {
    var identifiers = d[2];
    var statement = d[6] ? d[6][0] : undefined;
    var expression = d[7];
    return {
      node: "expression",
      type: "local",
      identifiers: identifiers,
      statement: statement,
      expression: expression,
    };
  }
%}

exp_terminal_conditional -> "if" __ exp_expression __ "then" __ (stm_sequence __):? exp_expression __ ("else" __ (stm_sequence __):? exp_expression __):? "end" {%
  function(d, position, reject) {
    var condition = d[2];
    var trueClause = {
      statement: d[6] ? d[6][0]: undefined,
      expression: d[7],
    };

    var falseClause = d[9]
      ? { statement: d[9][2] ? d[9][2][0] : undefined, expression: d[9][3] }
      : undefined;

    return {
      node: "expression",
      type: "conditional",
      condition: condition,
      trueClause: trueClause,
      falseClause: falseClause,
    }
  }
%}

exp_terminal_try -> "try" __ (stm_sequence __):? exp_expression __ "catch" __ ids_identifier __ "then" __ (stm_sequence __):? exp_expression __ "end" {%
  function(d) {
    var tryClause = {
      statement: d[2] ? d[2][0] : undefined,
      expression: d[3],
    };
    var exceptionIdentifier = d[7];
    var exceptionClause = {
      statement: d[11] ? d[11][0] : undefined,
      expression: d[12],
    };

    return {
      node: "expression",
      type: "exceptionContext",
      tryClause: tryClause,
      exceptionClause: exceptionClause,
      exceptionIdentifier: exceptionIdentifier,
    };
  }
%}

exp_terminal_pattern_matching -> "case" __ exp_expression __ "of" __ pat_pattern __ "then" __ (stm_sequence __):? exp_expression __ ("[]" __ pat_pattern __ "then" __ (stm_sequence __):? exp_expression __ ):* ("else" __ (stm_sequence __):? exp_expression __):? "end" {%
  function(d, position, reject) {
    var identifier = d[2];
    var initialClause = {
      pattern: d[6],
      statement: d[10] ? d[10][0] : undefined,
      expression: d[11],
    };
    var clauses = d[13].reduce(function(result, clause) {
      result.push({
        pattern: clause[2],
        statement: clause[6] ? clause[6][0] : undefined,
        expression: clause[7]
      });
      return result;
    }, [initialClause]);
    var falseClause = d[14]
      ? { statement: d[14][2] ? d[14][2][0] : undefined, expression: d[14][3] }
      : undefined;

    return {
      node: "expression",
      type: "patternMatching",
      identifier: identifier,
      clauses: clauses,
      falseClause: falseClause,
    };
  }
%}

exp_terminal_thread -> "thread" __ (stm_sequence __):? exp_expression __ "end" {%
  function(d, position, reject) {
    var statement = d[2] ? d[2][0] : undefined;
    var expression = d[3];
    return {
      node: "expression",
      type: "thread",
      statement: statement,
      expression: expression,
    };
  }
%}

exp_terminal_name_creation-> "{" _ "NewName" _ "}" {%
  function(d) {
    return {
      node: "expression",
      type: "nameCreation",
    };
  }
%}

exp_terminal_cell_creation -> "{" _ "NewCell" __ exp_expression _ "}" {%
  function(d) {
    return {
      node: "expression",
      type: "cellCreation",
      value: d[4],
    };
  }
%}

exp_terminal_port_creation -> "{" _ "NewPort" __ ids_identifier _ "}" {%
  function(d) {
    return {
      node: "expression",
      type: "portCreation",
      value: d[4],
    };
  }
%}

##############################################################################
# IDS - IDENTIFIERS
##############################################################################
ids_identifier ->
   "?":? ids_identifier_syntax {% idsBuildIdentifier %}

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

any_identifier -> "_" {% anyBuildIdentifier %}

##############################################################################
# LIT - LITERALS
##############################################################################

lit_value ->
    lit_atom {% id %}
  | lit_boolean {% id %}
  | lit_char {% id %}
  | lit_integer {% id %}
  | lit_float {% id %}
  | lit_procedure {% id %}
  | lit_function {% id %}

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
# Strings
##############################################################################
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
  | lit_zero_char {% litBuildNumber %}
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

lit_zero_char -> "0" {%
  function(d) {
    return 0;
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
# Functions
##############################################################################
lit_function -> "fun" _ "{" _ "$" lit_function_args:? _ "}" __  (stm_sequence __):? exp_expression __ "end" {%
  function(d) {
    var args = d[5];
    var statement = d[9] ? d[9][0] : undefined;
    var expression = d[10];
    return litBuildFunction(args, expression, statement);
  }
%}

lit_function_args ->
    __ ids_identifier {% function(d) { return [d[1]] } %}
  | lit_function_args __ ids_identifier {%
    function(d) {
      return d[0].concat(d[2])
    }
  %}


##############################################################################
# PAT - PATTERNS
##############################################################################

pat_pattern ->
    pat_terminal {% id %}
  | pat_cons_list_term {% id %}
  | pat_cons_tuple_term {% id %}

pat_cons_list_term -> pat_terminal _ "|" _ pat_pattern {%
  function(d) {
    return litBuildRecord("|", {
      1: d[0],
      2: d[4],
    });
  }
%}

pat_cons_tuple_term -> pat_terminal _ ("#" _ pat_terminal _):+ {%
  function(d) {
    var label = "#";
    var featureList = [d[0]].concat(d[2].map(function(item) {
      return item[2];
    }));
    var features = featureList.reduce(function(result, item, index) {
      result[++index] = item;
      return result;
    }, {});

    return litBuildRecord(label, features);
  }
%}

pat_terminal ->
    ids_identifier {% id %}
  | any_identifier {% id %}
  | lit_char {% id %}
  | lit_integer {% id %}
  | lit_float {% id %}
  | lit_atom {% id %}
  | lit_boolean {% id %}
  | pat_record {% id %}
  | pat_tuple {% id %}
  | pat_list {% id %}
  | pat_string {% id %}

pat_record -> lit_atom_syntax "(" _ pat_record_feature_list _ ")" {%
  function(d, position, reject) {
    var label = d[0];
    var features = d[3].reduce(function(result, item) {
      result[item.name] = item.value;
      return result;
    }, {});
    return litBuildRecord(label, features);
  }
%}

pat_record_feature_list ->
    pat_record_feature_list __ pat_record_feature {% function(d) { return d[0].concat(d[2]); } %}
  | pat_record_feature

pat_record_feature -> lit_atom_syntax ":" pat_pattern {%
  function(d, position, reject) {
    return {name: d[0], value: d[2]};
  }
%}

pat_tuple -> lit_atom_syntax "(" _ pat_list_items _ ")" {%
  function(d, position, reject) {
    var label = d[0];
    var features = d[3].reduce(function(result, item, index) {
      result[++index] = item;
      return result;
    }, {});
    return litBuildRecord(label, features);
  }
%}

pat_list ->
    pat_empty_list {% id %}
  | pat_list_with_items {% id %}

pat_list_with_items -> "[" _ pat_list_items _ "]" {%
  function(d) {
    return litBuildList(d[2]);
  }
%}

pat_empty_list -> "[" _ "]" {%
  function(d) {
    return litBuildList([]);
  }
%}

pat_list_items ->
    pat_pattern
  | pat_list_items __ pat_pattern {%
      function(d) {
        return d[0].concat(d[2]);
      }
    %}

pat_string -> lit_string_syntax {% 
  function(d) {
    return litBuildString(d[0]);
  }
%}

##############################################################################
# LIB - UTILITIES
##############################################################################
whitespace -> wschar | comment

_ -> whitespace:* {% function(d) {return null;} %}
__ -> whitespace:+ {% function(d) {return null;} %}

wschar -> [ \t\n\v\f\r] {% id %}

comment -> inline_comment | nested_comment

inline_comment -> "%" [^\n\r]:* [\n\r] {% function (d) { return null; } %}

nested_comment -> "/*" [^\*/]:* "*/" {% function (d) { return null; } %}

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

