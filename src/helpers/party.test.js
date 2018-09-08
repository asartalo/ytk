import {
  idToPath,
  idToPlayerPath,
  prepForQueue,
  findUserNameFromId,
  secondsDifference,
  hasPartyChanged,
  hasCurrentChanged,
} from './party';
import { mockRandomForEach } from 'jest-mock-random';
import staticVideoData from 'fixtures/staticVideoData';
import { party as defaultParty } from 'fixtures/parties';

describe('helpers/party', () => {
  describe('idToPath()', () => {
    it('converts id to path', () => {
      expect(idToPath('the-id-123')).toEqual('/the-id-123');
    });
  });

  describe('idToPlayerPath()', () => {
    it('converts id to player path', () => {
      expect(idToPlayerPath('the-id-123')).toEqual('/the-id-123/player');
    });
  });

  describe('prepForQueue()', () => {
    let result, video;
    video = staticVideoData[0];

    mockRandomForEach(0.888888);
    beforeEach(() => {
      result = prepForQueue(video, 'AUSERID');
    });

    it('adds queueId to video', () => {
      expect(result.queueId).toEqual(`${video.videoId}-88888`);
    });

    it('adds uid', () => {
      expect(result.addedBy).toEqual('AUSERID');
    });
  });

  describe('findUserNameFromId()', () => {
    let users;
    beforeEach(() => {
      users = [
        {
          name: 'Jane',
          uid: 'JAID',
        },
        {
          name: 'Sam',
          uid: 'SAID',
        },
      ];
    });

    it('finds user name', () => {
      expect(findUserNameFromId('SAID', users)).toEqual('Sam');
    });

    it('returns null when not found', () => {
      expect(findUserNameFromId('BOO', users)).toBe(null);
    });
  });

  describe('secondsDifference', () => {
    [
      {
        a: 1,
        b: 2,
        result: false,
      },
      {
        a: 2,
        b: 1,
        result: false,
      },
      {
        a: 2.0001,
        b: 1,
        result: true,
      },
      {
        a: 1,
        b: 2.0001,
        result: true,
      },
      {
        a: null,
        b: 2,
        result: false,
      },
      {
        a: 2,
        b: null,
        result: false,
      },
    ].forEach(({ a, b, result }) => {
      it(`handles (${a}, ${b}) and returns ${result}`, () => {
        expect(secondsDifference(a, b)).toEqual(result);
      });
    });
  });

  describe('hasPartyChanged()', () => {
    [
      {
        desc: 'when before and after refer to the same object',
        before: defaultParty,
        after: defaultParty,
        result: false,
      },
      {
        desc: 'when different object but the same data',
        before: defaultParty,
        after: { ...defaultParty },
        result: false,
      },
      {
        desc: 'when their queue lengths are different',
        before: defaultParty,
        after: { ...defaultParty, queue: defaultParty.queue.slice(1) },
        result: true,
      },
      {
        desc: 'when current has changed',
        before: defaultParty,
        after: {
          ...defaultParty,
          current: {
            ...defaultParty.current,
            queueId: 'some-random-queueId',
          },
        },
        result: true,
      },
    ].forEach(({ desc, before, after, result }) => {
      describe(desc, () => {
        it(`returns ${result}`, () => {
          expect(hasPartyChanged(before, after)).toEqual(result);
        });
      });
    });
  });

  describe('hasCurrentChanged', () => {
    const sample = defaultParty.current;
    [
      {
        desc: 'when they refer to the same object',
        before: sample,
        after: sample,
        result: false,
      },
      {
        desc: 'when they have the same data',
        before: sample,
        after: { ...sample },
        result: false,
      },
      {
        desc: 'when before is null',
        before: null,
        after: sample,
        result: true,
      },
      {
        desc: 'when after is null',
        before: sample,
        after: null,
        result: true,
      },
      {
        desc: 'when queueId changed',
        before: sample,
        after: { ...sample, queueId: 'a different queueId' },
        result: true,
      },
      {
        desc: 'when isPlaying changed',
        before: { ...sample, isPlaying: false },
        after: { ...sample, isPlaying: true },
        result: true,
      },
      {
        desc: 'when there is less than 1 second change',
        before: { ...sample, at: 0 },
        after: { ...sample, at: 0.5 },
        result: false,
      },
      {
        desc: 'when there is 1 second change',
        before: { ...sample, at: 0 },
        after: { ...sample, at: 1 },
        result: false,
      },
      {
        desc: 'when there is more than 1 second change',
        before: { ...sample, at: 0 },
        after: { ...sample, at: 1.0000001 },
        result: true,
      },
    ].forEach(({ desc, before, after, result }) => {
      describe(desc, () => {
        it(`returns ${result}`, () => {
          expect(hasCurrentChanged(before, after)).toEqual(result);
        });
      });
    });
  });
});
