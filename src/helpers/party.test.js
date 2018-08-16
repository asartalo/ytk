import { idToPath, idToPlayerPath } from './party';

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
});
