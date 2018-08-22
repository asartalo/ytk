export function idToPath(id) {
  return `/${id}`;
}

export function idToPlayerPath(id) {
  return `${idToPath(id)}/player`;
}

export function idToFullUrl(id) {
  const loc = window.location;
  return loc.protocol + '//' + loc.host + idToPath(id);
}
