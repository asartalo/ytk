export default function action(type, data) {
  return data === undefined ? { type } : { type, data };
}
