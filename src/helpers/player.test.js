import { ytPlayerState } from './player';

describe('ytPlayerState()', () => {
  const testData = new Map([
    [-1, 'unstarted'],
    [0, 'ended'],
    [1, 'playing'],
    [2, 'paused'],
    [3, 'buffering'],
    [5, 'cued'],
    [-2, undefined],
    [4, undefined],
  ]);

  testData.forEach((expected, input) => {
    it(`returns state for ${input}`, () => {
      expect(ytPlayerState(input)).toEqual(expected);
    });
  });
});
