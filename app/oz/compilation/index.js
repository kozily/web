import { statementSyntaxTypes } from "../machine/statementSyntax";
import {
  kernelLiteralTypes,
  compilableLiteralTypes,
} from "../machine/literals";
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
import cellCreation from "./statements/cell_creation";
import cellExchange from "./statements/cell_exchange";
import portCreation from "./statements/port_creation";
import portSend from "./statements/port_send";
import nameCreation from "./statements/name_creation";
import thread from "./statements/thread";
import byNeed from "./statements/by_need";
import number from "./literals/number";
import record from "./literals/record";
import procedure from "./literals/procedure";
import functionCompiler from "./literals/function";
import literalExpression from "./expressions/literal";
import identifierExpression from "./expressions/identifier";
import operatorExpression from "./expressions/operator";

export const compilers = {
  statement: {
    [statementSyntaxTypes.skipSyntax]: skip,
    [statementSyntaxTypes.bindingSyntax]: binding,
    [statementSyntaxTypes.sequenceSyntax]: sequence,
    [statementSyntaxTypes.conditionalSyntax]: conditional,
    [statementSyntaxTypes.localSyntax]: local,
    [statementSyntaxTypes.patternMatchingSyntax]: patternMatching,
    [statementSyntaxTypes.procedureApplicationSyntax]: procedureApplication,
    [statementSyntaxTypes.exceptionContextSyntax]: exceptionContext,
    [statementSyntaxTypes.exceptionRaiseSyntax]: exceptionRaise,
    [statementSyntaxTypes.threadSyntax]: thread,
    [statementSyntaxTypes.byNeedSyntax]: byNeed,
    [statementSyntaxTypes.cellCreationSyntax]: cellCreation,
    [statementSyntaxTypes.cellExchangeSyntax]: cellExchange,
    [statementSyntaxTypes.portCreationSyntax]: portCreation,
    [statementSyntaxTypes.portSendSyntax]: portSend,
    [statementSyntaxTypes.nameCreationSyntax]: nameCreation,
  },
  literal: {
    [kernelLiteralTypes.number]: number,
    [kernelLiteralTypes.record]: record,
    [kernelLiteralTypes.procedure]: procedure,
    [compilableLiteralTypes.function]: functionCompiler,
  },
  expression: {
    [kernelExpressionTypes.literal]: literalExpression,
    [kernelExpressionTypes.identifier]: identifierExpression,
    [kernelExpressionTypes.operator]: operatorExpression,
  },
};

export const compile = (...args) => {
  if (!args[0]) return null;
  const compiler = compilers[args[0].get("node")][args[0].get("type")];
  return compiler(compile, ...args);
};
