export function idToPath(id) {
  return `/${id}`;
}

export function idToPlayerPath(id) {
  return `${idToPath(id)}/player`;
}
