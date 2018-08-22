import { mockRandomForEach } from 'jest-mock-random';
import reducerTest from 'helpers/reducerTest';
import * as actions from 'actions/partyActions';
import staticQueueData from 'components/party/staticQueueData';
import party from './party';

describe('party', () => {
  mockRandomForEach(0.99999999);
  const initialState = {
    name: '',
    users: [],
    queue: [],
    id: '',
  };

  const sampleQueuedVideo = {
    ...staticQueueData[1],
    queueId: `${staticQueueData[1].videoId}-12233}`,
    addedBy: 'SOMEID',
  };

  const video = staticQueueData[0];
  const currentVideo = {
    ...video,
    queueId: `${video.videoId}-${99999}`,
    addedBy: 'MYUID',
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
        current: {
          ...sampleQueuedVideo,
          isPlaying: false,
        },
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
        current: {
          ...sampleQueuedVideo,
          isPlaying: false,
        },
      },
    },

    'PARTY_ADD_TO_QUEUE when queue is not empty': {
      from: { queue: [sampleQueuedVideo] },
      action: actions.addToQueue(video, 'MYUID'),
      expect: {
        queue: [
          sampleQueuedVideo,
          {
            ...video,
            queueId: `${video.videoId}-${99999}`,
            addedBy: 'MYUID',
          },
        ],
      },
    },
  });
});
