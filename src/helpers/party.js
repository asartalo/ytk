import randomInt from './randomInt';

export function idToPath(id) {
  return `/${id}`;
}

export function idToPlayerPath(id) {
  return `${idToPath(id)}/player`;
}

export function idToJoinPath(id) {
  return `${idToPath(id)}/join`;
}

export function idToFullUrl(id) {
  const loc = window.location;
  return loc.protocol + '//' + loc.host + idToPath(id);
}

export function idToPlayerUrl(id) {
  const loc = window.location;
  return loc.protocol + '//' + loc.host + idToPlayerPath(id);
}

export function prepForQueue(video, uid) {
  return {
    ...video,
    queueId: `${video.videoId}-${randomInt(99999)}`,
    addedBy: uid,
  };
}

export function findUserNameFromId(id, users) {
  const found = users.find(user => user.uid === id);
  return found ? found.name : null;
}

export function secondsDifference(a, b) {
  if (typeof a !== 'number' || typeof b !== 'number') return false;
  return Math.abs(a - b) > 1;
}

export function hasPartyChanged(before, after) {
  if (before === after) {
    return false;
  }

  if (before.queue.length !== after.queue.length) {
    return true;
  }
  if (hasCurrentChanged(before.current, after.current)) {
    return true;
  }
  return false;
}

export function hasCurrentChanged(before, after) {
  if (!before !== !after) {
    return true;
  }

  const valueFields = ['isPlaying', 'queueId'];
  for (let field of valueFields) {
    if (before[field] !== after[field]) {
      return true;
    }
  }

  if (secondsDifference(before.at, after.at)) {
    return true;
  }
  return false;
}
