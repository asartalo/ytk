import {
  idToPath,
  idToPlayerPath,
  prepForQueue,
  findUserNameFromId,
} from './party';
import { mockRandomForEach } from 'jest-mock-random';
import staticVideoData from 'fixtures/staticVideoData';

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
});
