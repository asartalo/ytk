import enforcedActionTypes from './enforcedActionTypes';

describe('enforcedActionTypes', () => {
  let types;
  beforeEach(() => {
    types = enforcedActionTypes('FOO');
  });

  it('makes string constants accessible as methods', () => {
    expect(types.FOO).toEqual('FOO');
  });

  it('throws an error when accessing undefined type', () => {
    expect(() => types.BAR).toThrow(
      new Error("'BAR' action type was not defined")
    );
  });
});
