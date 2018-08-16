import * as themeHelpers from './theme';

describe('theme helpers', () => {
  describe('themeToggle', () => {
    let theme;
    beforeEach(() => {
      theme = { palette: { type: 'light' } };
    });

    it('returns light version when theme is light', () => {
      const result = themeHelpers.themeToggle(theme, 'A', 'B');
      expect(result).toEqual('A');
    });

    it('returns dark version when theme is dark', () => {
      theme.palette.type = 'dark';
      const result = themeHelpers.themeToggle(theme, 'A', 'B');
      expect(result).toEqual('B');
    });

    it('throws error for unknown themes', () => {
      theme.palette.type = 'FOOBAR';
      expect(() => {
        themeHelpers.themeToggle(theme, 'A', 'B');
      }).toThrow(Error("Unknown theme 'FOOBAR'"));
    });
  });
});
