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
    at: 0.0,
  };

  const queuedVideosWithoutCurrent = queuedVideos.filter(
    video => video.queueId !== currentVideo.queueId
  );

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
          at: 0.0,
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

    PARTY_SET_CURRENT_AT: {
      from: { current: currentVideo },
      action: actions.setCurrentAt(6),
      expect: {
        current: { ...currentVideo, at: 6 },
      },
    },

    'PARTY_SET_CURRENT_AT with no change': {
      from: { current: { ...currentVideo, at: 7 } },
      action: actions.setCurrentAt(7),
      expect: 'same',
    },

    'PARTY_SKIP when queue is empty pauses the current video': {
      from: {
        current: { ...currentVideo, isPlaying: true },
      },
      action: actions.skip(null),
      expect: {
        current: { ...currentVideo, isPlaying: false },
      },
    },

    'PARTY_SKIP when queue is filled shifts queue first item to current': {
      from: {
        current: { ...currentVideo, isPlaying: true },
        queue: [...queuedVideosWithoutCurrent],
      },
      action: actions.skip({
        from: currentVideo.queueId,
        to: queuedVideosWithoutCurrent[0].queueId,
      }),
      expect: {
        current: { ...queuedVideosWithoutCurrent[0], isPlaying: true, at: 0.0 },
        queue: queuedVideosWithoutCurrent.slice(1),
      },
    },

    'PARTY_SKIP when from item does not match current does nothing': {
      from: {
        current: { ...currentVideo, isPlaying: true },
        queue: [...queuedVideosWithoutCurrent],
      },
      action: actions.skip({
        from: queuedVideosWithoutCurrent[0].queueId,
        to: queuedVideosWithoutCurrent[1].queueId,
      }),
      expect: 'same',
    },

    'PARTY_SKIP when to already matches current it does nothing': {
      from: {
        current: { ...queuedVideosWithoutCurrent[0], isPlaying: true, at: 0.0 },
        queue: queuedVideosWithoutCurrent.slice(1),
      },
      action: actions.skip({
        from: currentVideo.queueId,
        to: queuedVideosWithoutCurrent[0].queueId,
      }),
      expect: 'same',
    },

    'PARTY_SKIP when to is not in queue does nothing': {
      from: {
        current: { ...currentVideo, isPlaying: true },
        queue: [...queuedVideosWithoutCurrent],
      },
      action: actions.skip({
        from: currentVideo.queueId,
        to: 'some-other-id-that-does-not-exist',
      }),
      expect: 'same',
    },

    'PARTY_SKIP can skip to any video in queue': {
      from: {
        current: { ...currentVideo, isPlaying: true },
        queue: [...queuedVideosWithoutCurrent],
      },
      action: actions.skip({
        from: currentVideo.queueId,
        to: queuedVideosWithoutCurrent[2].queueId,
      }),
      expect: {
        current: { ...queuedVideosWithoutCurrent[2], isPlaying: true, at: 0.0 },
        queue: queuedVideosWithoutCurrent.filter(
          item => queuedVideosWithoutCurrent[2] !== item
        ),
      },
    },
  });
});
