import { idToPath } from './party';

describe('helpers/party', () => {
  describe('idToPath()', () => {
    it('converts id to path', () => {
      expect(idToPath('the-id-123')).toEqual('/the-id-123');
    });
  });
});
