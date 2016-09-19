import sum from '../app/sum';

describe('A sample suite', () => {
  it('contains a spec with an expectation', () => {
    expect(sum(1, 2)).toBe(3);
  });
});
