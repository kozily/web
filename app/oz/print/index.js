import { statementTypes } from "../machine/statements";
import { valueTypes } from "../machine/values";
import { literalTypes } from "../machine/literals";
import { expressionTypes } from "../machine/expressions";
import skip from "./skip";
import binding from "./binding";
import sequence from "./sequence";
import conditional from "./conditional";
import local from "./local";
import valueCreation from "./value_creation";
import patternMatching from "./pattern_matching";
import procedureApplication from "./procedure_application";
import exceptionContext from "./exception_context";
import exceptionRaise from "./exception_raise";
import exceptionCatch from "./exception_catch";
import thread from "./thread";
import byNeed from "./by_need";
import numberLiteral from "./literals/number";
import recordLiteral from "./literals/record";
import procedureLiteral from "./literals/procedure";
import numberValue from "./values/number";
import recordValue from "./values/record";
import procedureValue from "./values/procedure";
import builtIn from "./built_in";
import literalExpression from "./literal_expression";
import identifierExpression from "./identifier_expression";
import operatorExpression from "./operator_expression";

export const printers = {
  statement: {
    [statementTypes.skip]: skip,
    [statementTypes.binding]: binding,
    [statementTypes.sequence]: sequence,
    [statementTypes.conditional]: conditional,
    [statementTypes.local]: local,
    [statementTypes.valueCreation]: valueCreation,
    [statementTypes.patternMatching]: patternMatching,
    [statementTypes.procedureApplication]: procedureApplication,
    [statementTypes.exceptionContext]: exceptionContext,
    [statementTypes.exceptionRaise]: exceptionRaise,
    [statementTypes.exceptionCatch]: exceptionCatch,
    [statementTypes.thread]: thread,
    [statementTypes.byNeed]: byNeed,
  },
  literal: {
    [literalTypes.number]: numberLiteral,
    [literalTypes.record]: recordLiteral,
    [literalTypes.procedure]: procedureLiteral,
  },
  value: {
    [valueTypes.number]: numberValue,
    [valueTypes.record]: recordValue,
    [valueTypes.procedure]: procedureValue,
    [valueTypes.builtIn]: builtIn,
  },
  expression: {
    [expressionTypes.literal]: literalExpression,
    [expressionTypes.identifier]: identifierExpression,
    [expressionTypes.operator]: operatorExpression,
  },
};

export const print = (node, identation = 0) => {
  if (!node) return { full: "", abbreviated: "" };
  const printer = printers[node.get("node")][node.get("type")];
  return printer(print, node, identation);
};
