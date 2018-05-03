import { statementTypes } from "../machine/statements";
import { valueTypes } from "../machine/values";
import { kernelLiteralTypes } from "../machine/literals";
import { kernelExpressionTypes } from "../machine/expressions";
import skip from "./statements/skip";
import binding from "./statements/binding";
import sequence from "./statements/sequence";
import conditional from "./statements/conditional";
import local from "./statements/local";
import patternMatching from "./statements/pattern_matching";
import procedureApplication from "./statements/procedure_application";
import exceptionContext from "./statements/exception_context";
import exceptionRaise from "./statements/exception_raise";
import exceptionCatch from "./statements/exception_catch";
import thread from "./statements/thread";
import byNeed from "./statements/by_need";
import cellCreation from "./statements/cell_creation";
import cellExchange from "./statements/cell_exchange";
import portCreation from "./statements/port_creation";
import portSend from "./statements/port_send";
import nameCreation from "./statements/name_creation";
import numberLiteral from "./literals/number";
import recordLiteral from "./literals/record";
import procedureLiteral from "./literals/procedure";
import numberValue from "./values/number";
import recordValue from "./values/record";
import procedureValue from "./values/procedure";
import builtInValue from "./values/built_in";
import mutableValue from "./values/mutable";
import nameValue from "./values/name";
import literalExpression from "./expressions/literal";
import identifierExpression from "./expressions/identifier";
import operatorExpression from "./expressions/operator";

export const printers = {
  statement: {
    [statementTypes.skip]: skip,
    [statementTypes.binding]: binding,
    [statementTypes.sequence]: sequence,
    [statementTypes.conditional]: conditional,
    [statementTypes.local]: local,
    [statementTypes.patternMatching]: patternMatching,
    [statementTypes.procedureApplication]: procedureApplication,
    [statementTypes.exceptionContext]: exceptionContext,
    [statementTypes.exceptionRaise]: exceptionRaise,
    [statementTypes.exceptionCatch]: exceptionCatch,
    [statementTypes.thread]: thread,
    [statementTypes.byNeed]: byNeed,
    [statementTypes.cellCreation]: cellCreation,
    [statementTypes.cellExchange]: cellExchange,
    [statementTypes.portCreation]: portCreation,
    [statementTypes.portSend]: portSend,
    [statementTypes.nameCreation]: nameCreation,
  },
  literal: {
    [kernelLiteralTypes.number]: numberLiteral,
    [kernelLiteralTypes.record]: recordLiteral,
    [kernelLiteralTypes.procedure]: procedureLiteral,
  },
  value: {
    [valueTypes.number]: numberValue,
    [valueTypes.record]: recordValue,
    [valueTypes.procedure]: procedureValue,
    [valueTypes.builtIn]: builtInValue,
    [valueTypes.mutable]: mutableValue,
    [valueTypes.name]: nameValue,
  },
  expression: {
    [kernelExpressionTypes.literal]: literalExpression,
    [kernelExpressionTypes.identifier]: identifierExpression,
    [kernelExpressionTypes.operator]: operatorExpression,
  },
};

export const print = (node, identation = 0) => {
  if (!node) return { full: "Unbound", abbreviated: "Unbound" };
  const printer = printers[node.get("node")][node.get("type")];
  return printer(print, node, identation);
};
