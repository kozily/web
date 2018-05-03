import { Parser } from "nearley";
import Immutable from "immutable";
import ozGrammar from "./grammar/grammar.ne";

export const parserFor = grammar => {
  return input => {
    const parser = new Parser(grammar.ParserRules, grammar.ParserStart);
    parser.feed(input);

    if (parser.results.length > 1) {
      const results = JSON.stringify(parser.results);
      throw new Error(`Ambiguous parse tree ${results}`);
    }

    return Immutable.fromJS(parser.results[0]);
  };
};

export default parserFor(ozGrammar);
