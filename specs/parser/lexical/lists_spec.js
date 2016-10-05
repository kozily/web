import Immutable from 'immutable';
import { parserFor } from '../../../app/oz/parser';
import lexicalGrammar from '../../../app/oz/grammar/lexical.nearley';

const parse = parserFor(lexicalGrammar);

describe('Parsing lists', () => {
  beforeEach(() => {
    jasmine.addCustomEqualityTester(Immutable.is);
  });

  xit('handles empty lists correctly', () => {
    expect(parse('nil')).toBeLiteralLists('nil');
  });

  xit('handles lists correctly', () => {
    expect(parse('´|´(H T)')).toBeLiteralLists('´|´(H T)');
  });

  xit('handles lists with more than 1 element correctly', () => {
    expect(parse('´|´(H ´|´(M N))')).toBeLiteralLists('´|´(H ´|´(M N))');
  });

  xit('handles syntactic sugar ´|´ label can be written as an infix operator', () => {
    expect(parse('H|T')).toBeLiteralLists('´|´(H T)');
  });

  xit('handles syntactic sugar ´|´ operator associates to the right', () => {
    expect(parse('1|2|3|nil')).toBeLiteralLists('´|´(1 ´|´(2 ´|´(3 nil)))');
    expect(parse('1|(2|(3|nil))')).toBeLiteralLists('´|´(1 ´|´(2 ´|´(3 nil)))');
  });

  xit('handles syntactic sugar complete lists, when ends in nil can be written with brackets', () => {
    expect(parse('[1 2 3]')).toBeLiteralLists('´|´(1 ´|´(2 ´|´(3 nil)))');
  });
});
