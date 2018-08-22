import { mockRandomForEach } from 'jest-mock-random';
import reducerTest from 'helpers/reducerTest';
import * as actions from 'actions/partyActions';
import staticVideoData from 'fixtures/staticVideoData';
import queuedVideos from 'fixtures/queuedVideos';
import party from './party';

describe('party', () => {
  mockRandomForEach(0.99999999);
  const initialState = {
    name: '',
    users: [],
    queue: [],
    id: '',
  };

  const sampleQueuedVideo = queuedVideos[1];

  const video = staticVideoData[0];
  const videoQueued = {
    ...queuedVideos[0],
    queueId: `${video.videoId}-${99999}`,
    addedBy: 'MYUID',
  }; // this is based on staticVideoData[0]
  const currentVideo = {
    ...sampleQueuedVideo,
    isPlaying: false,
  };

  reducerTest(party, initialState, {
    PARTY_LOAD: {
      action: actions.loadParty({ name: 'New Year' }),
      expect: { name: 'New Year' },
    },

    'PARTY_ADD_TO_QUEUE when queue is empty and no current': {
      from: { queue: [] },
      action: actions.addToQueue(video, 'MYUID'),
      expect: {
        queue: [],
        current: {
          ...video,
          queueId: `${video.videoId}-${99999}`,
          addedBy: 'MYUID',
          isPlaying: false,
        },
      },
    },

    'PARTY_ADD_TO_QUEUE when queue is empty and there is current': {
      from: {
        queue: [],
        current: currentVideo,
      },
      action: actions.addToQueue(video, 'MYUID'),
      expect: {
        queue: [
          {
            ...video,
            queueId: `${video.videoId}-${99999}`,
            addedBy: 'MYUID',
          },
        ],
        current: currentVideo,
      },
    },

    'PARTY_ADD_TO_QUEUE when queue is not empty': {
      from: { queue: [sampleQueuedVideo] },
      action: actions.addToQueue(video, 'MYUID'),
      expect: {
        queue: [sampleQueuedVideo, videoQueued],
      },
    },

    PARTY_REMOVE_FROM_QUEUE: {
      from: { queue: [...queuedVideos] },
      action: actions.removeFromQueue(queuedVideos[0]),
      expect: { queue: [...queuedVideos].slice(1) },
    },

    'PARTY_SET_CURRENT_PLAYBACK true when current.isPlaying is false': {
      from: { current: currentVideo },
      action: actions.setPlayback(true),
      expect: {
        current: { ...currentVideo, isPlaying: true },
      },
    },

    'PARTY_SET_CURRENT_PLAYBACK false when current.isPlaying is true': {
      from: {
        current: { ...currentVideo, isPlaying: true },
      },
      action: actions.setPlayback(false),
      expect: { current: currentVideo },
    },
  });
});
