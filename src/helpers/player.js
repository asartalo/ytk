const playerStates = new Map([
  [-1, 'unstarted'],
  [0, 'ended'],
  [1, 'playing'],
  [2, 'paused'],
  [3, 'buffering'],
  [5, 'cued'],
]);
export function ytPlayerState(state) {
  return playerStates.get(state);
}
