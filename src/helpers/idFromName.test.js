import { mockRandomForEach } from 'jest-mock-random';
import idFromName from './idFromName';

describe('idFromName', () => {
  mockRandomForEach(0.7589);

  const testData = {
    'The Great Celebration': 'the-great-celebration-7589',
    'Somewhere @ Syzan, Russia': 'somewhere-@-syzan-russia-7589',
    'City of  Angels': 'city-of-angels-7589',
  };

  Object.entries(testData).forEach(([name, id]) => {
    it('generates an id based on name', () => {
      expect(idFromName(name)).toEqual(id);
    });
  });
});
