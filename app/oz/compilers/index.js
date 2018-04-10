import { statementTypes } from "../machine/statements";
import { valueTypes } from "../machine/values";
import operator from "./operator";
import local from "./local";
import sequence from "./sequence";
import conditional from "./conditional";
import patternMatching from "./pattern_matching";
import exceptionContext from "./exception_context";
import exceptionCatch from "./exception_catch";
import procedure from "./procedure";

const defaultCompile = (recurse, node) => node;

export const compilerCollectors = {
  statement: {
    [statementTypes.skip]: defaultCompile,
    [statementTypes.binding]: defaultCompile,
    [statementTypes.sequence]: sequence,
    [statementTypes.conditional]: conditional,
    [statementTypes.local]: local,
    [statementTypes.valueCreation]: defaultCompile,
    [statementTypes.patternMatching]: patternMatching,
    [statementTypes.procedureApplication]: defaultCompile,
    [statementTypes.exceptionContext]: exceptionContext,
    [statementTypes.exceptionRaise]: defaultCompile,
    [statementTypes.exceptionCatch]: exceptionCatch,
    operator: operator,
  },
  literal: {
    [valueTypes.procedure]: procedure,
    [valueTypes.number]: defaultCompile,
    [valueTypes.record]: defaultCompile,
  },
};

export const iterateCompilers = node => {
  const compile = compilerCollectors[node.get("node")][node.get("type")];
  return compile(iterateCompilers, node);
};
