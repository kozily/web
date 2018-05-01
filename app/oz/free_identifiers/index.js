import Immutable from "immutable";
import { statementTypes } from "../machine/statements";
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
import number from "./literals/number";
import record from "./literals/record";
import procedure from "./literals/procedure";
import literalExpression from "./expressions/literal";
import identifierExpression from "./expressions/identifier";
import operatorExpression from "./expressions/operator";

export const collectors = {
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
    [kernelLiteralTypes.number]: number,
    [kernelLiteralTypes.record]: record,
    [kernelLiteralTypes.procedure]: procedure,
  },
  expression: {
    [kernelExpressionTypes.literal]: literalExpression,
    [kernelExpressionTypes.identifier]: identifierExpression,
    [kernelExpressionTypes.operator]: operatorExpression,
  },
};

export const collectFreeIdentifiers = node => {
  if (!node) {
    return Immutable.Set();
  }
  const nodeValue = node.get("node");
  if (nodeValue === "identifier") {
    const identifier = node.get("identifier");
    return identifier === "_" ? Immutable.Set() : Immutable.Set.of(identifier);
  }
  const collector = collectors[nodeValue][node.get("type")];

  return collector(collectFreeIdentifiers, node);
};
