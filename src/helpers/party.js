import randomInt from './randomInt';

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
