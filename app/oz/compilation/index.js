import { statementSyntaxTypes } from "../machine/statementSyntax";
import { valueTypes } from "../machine/values";
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
import thread from "./thread";
import byNeed from "./by_need";
import operator from "./operator";
import number from "./number";
import record from "./record";
import procedure from "./procedure";

export const compilers = {
  statement: {
    [statementSyntaxTypes.skipSyntax]: skip,
    [statementSyntaxTypes.bindingSyntax]: binding,
    [statementSyntaxTypes.sequenceSyntax]: sequence,
    [statementSyntaxTypes.conditionalSyntax]: conditional,
    [statementSyntaxTypes.localSyntax]: local,
    [statementSyntaxTypes.valueCreationSyntax]: valueCreation,
    [statementSyntaxTypes.patternMatchingSyntax]: patternMatching,
    [statementSyntaxTypes.procedureApplicationSyntax]: procedureApplication,
    [statementSyntaxTypes.exceptionContextSyntax]: exceptionContext,
    [statementSyntaxTypes.exceptionRaiseSyntax]: exceptionRaise,
    [statementSyntaxTypes.operatorSyntax]: operator,
    [statementSyntaxTypes.threadSyntax]: thread,
    [statementSyntaxTypes.byNeedSyntax]: byNeed,
  },
  literal: {
    [valueTypes.number]: number,
    [valueTypes.record]: record,
    [valueTypes.procedure]: procedure,
  },
};

export const compile = node => {
  if (!node) return null;
  const compiler = compilers[node.get("node")][node.get("type")];
  return compiler(compile, node);
};
