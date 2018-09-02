import Signal from './signal';
import randomInt from 'helpers/randomInt';

describe('signal', () => {
  let signal, storage, win, counter, timestampFunc;
  beforeEach(() => {
    storage = {
      setItem: jest.fn(),
      getItem: jest.fn(),
      removeItem: jest.fn(),
    };
    win = {
      addEventListener: jest.fn(),
    };
    timestampFunc = jest.fn(() => counter++);
    signal = new Signal(storage, win, timestampFunc);
  });

  it('listens to storage changes', () => {
    expect(win.addEventListener).toHaveBeenCalledWith(
      'storage',
      signal.handler
    );
  });

  describe('#send()', () => {
    let random;
    beforeEach(() => {
      random = randomInt();
      timestampFunc.mockReturnValue(random);
      signal.send('foo', [1, 2]);
    });

    it('writes to localStorage', () => {
      expect(storage.setItem).toHaveBeenCalledWith(
        'SIGNAL:foo',
        `${JSON.stringify([1, 2])}:${random}`
      );
    });
  });

  describe('listening', () => {
    let callback, event;
    beforeEach(() => {
      callback = jest.fn();
      event = {
        key: 'SIGNAL:foo',
        newValue: `${JSON.stringify('bar')}:124`,
        oldValue: `${JSON.stringify('car')}:123`,
      };
      signal.listen('foo', callback);
    });

    describe('when handler is called with storage event not listenend to', () => {
      beforeEach(() => {
        event.key = 'SIGNAL:zoo';
        signal.handler(event);
      });

      it('does not call listener', () => {
        expect(callback).not.toHaveBeenCalled();
      });
    });

    describe('when handler is called with storage event listenend to', () => {
      beforeEach(() => {
        signal.handler(event);
      });

      it('calls listener', () => {
        expect(callback).toHaveBeenCalledWith('bar', 'car');
      });
    });

    describe('when listener is removed before handler is called', () => {
      beforeEach(() => {
        signal.clear('foo', callback);
        signal.handler(event);
      });

      it('does not call listener', () => {
        expect(callback).not.toHaveBeenCalled();
      });
    });

    describe('when null oldValue for event', () => {
      let newCallback;
      beforeEach(() => {
        event.oldValue = null;
        newCallback = jest.fn();
        signal.listen('foo', newCallback);
        signal.handler(event);
      });

      it('properly handles null values', () => {
        expect(newCallback).toHaveBeenCalledWith('bar', null);
      });
    });

    describe('multiple listeners', () => {
      let first, second, calls;
      beforeEach(() => {
        calls = [];
        first = () => calls.push(1);
        second = () => calls.push(2);
        signal.listen('foo', first);
        signal.listen('foo', second);
        signal.handler(event);
      });

      it('calls all listeners in sequence', () => {
        expect(calls).toEqual([1, 2]);
      });
    });
  });
});
