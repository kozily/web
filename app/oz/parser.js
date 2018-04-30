import { Parser } from "nearley";
import Immutable from "immutable";
import ozGrammar from "./grammar/grammar.ne";

export const parserFor = grammar => {
  return input => {
    const parser = new Parser(grammar.ParserRules, grammar.ParserStart);
    parser.feed(input);

    if (parser.results.length > 1) {
      throw new Error("Ambiguous parse tree");
    }

    return Immutable.fromJS(parser.results[0]);
  };
};

export default parserFor(ozGrammar);
