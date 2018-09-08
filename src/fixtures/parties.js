import { profiles } from './users';
import queuedVideos from './queuedVideos';

export const party = {
  name: 'The Party',
  id: 'the-party-123',
  users: [...profiles],
  queue: queuedVideos.slice(1),
  current: {
    ...queuedVideos[0],
    isPlaying: false,
    at: 0,
  },
};
