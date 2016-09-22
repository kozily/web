import { Parser } from 'nearley';
import grammar from './grammar.nearley';

export default function (input) {
  const parser = new Parser(grammar.ParserRules, grammar.ParserStart);
  parser.feed(input);
  return parser.results;
}
