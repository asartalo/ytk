export const themeToggle = (theme, light, dark) => {
  switch (theme.palette.type) {
    case 'dark':
      return dark;
    case 'light':
      return light;
    default:
      throw Error(`Unknown theme '${theme.palette.type}'`);
  }
};
