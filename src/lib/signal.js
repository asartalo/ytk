function trueKey(key) {
  return `SIGNAL:${key}`;
}

class Signal {
  constructor(storage, win, timestampFn) {
    this.storage = storage;
    this.handler = this.handler.bind(this);
    this.listeners = new Map([]);
    this.timestamp = timestampFn;
    win.addEventListener('storage', this.handler);
  }

  send(key, value) {
    this.storage.setItem(trueKey(key), this._sendValue(value));
  }

  _sendValue(value) {
    return `${JSON.stringify(value)}:${this.timestamp()}`;
  }

  _parseValue(value) {
    if (!value) return value;
    const match = value.match(/(.+):\d+$/);
    return JSON.parse(match[1]);
  }

  handler({ key, newValue, oldValue }) {
    const { listeners } = this;
    if (listeners.has(key)) {
      listeners
        .get(key)
        .forEach(listener =>
          listener(this._parseValue(newValue), this._parseValue(oldValue))
        );
    }
  }

  listen(key, listener) {
    const theKey = trueKey(key);
    const { listeners } = this;
    listeners.set(theKey, (listeners.get(theKey) || []).concat([listener]));
  }

  clear(key, listener) {
    const theKey = trueKey(key);
    const { listeners } = this;
    if (listeners.has(theKey)) {
      listeners.set(
        theKey,
        listeners.get(theKey).filter(item => item !== listener)
      );
    }
  }
}

export default Signal;
