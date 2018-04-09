import { statementTypes } from "../machine/statements";
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
import exceptionCatch from "./exception_catch";
import number from "./number";
import record from "./record";
import procedure from "./procedure";

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
  },
  literal: {
    [valueTypes.number]: number,
    [valueTypes.record]: record,
    [valueTypes.procedure]: procedure,
  },
  value: {
    [valueTypes.number]: number,
    [valueTypes.record]: record,
    [valueTypes.procedure]: procedure,
  },
};

export const print = (node, identation = 0) => {
  const printer = printers[node.get("node")][node.get("type")];
  return printer(print, node, identation);
};
