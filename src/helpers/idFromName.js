import randomInt from './randomInt';

export default function idFromName(name) {
  return name
    .toLowerCase()
    .replace(/[^\w\s@&]/g, '')
    .split(/\s+/)
    .concat(randomInt())
    .join('-');
}
