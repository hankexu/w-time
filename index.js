const ioredis = require('ioredis');
const EventEmitter = require('events');
const child_process = require('child_process');

class TimeWindow extends EventEmitter {

  constructor(duration, limit) {
    super();
    this.duration = duration;
    this.limit = limit;
    this.data = new Map();
    this.index = 0;
  }

  async add(key, data) {
    const timestamp = Date.now();
    if (arguments.length === 2) {
      this.data.set(this.index++, {
        data,
        timestamp
      });
    }
    this.cleanTimeout();
    if (this.data.size > this.limit) {
      this.emit('overflow', this.data.size, this.data);
    }
  }

  cleanTimeout() {
    const keys = Array.from(this.data.keys());
    const values = Array.from(this.data.values());
    const index = values.findIndex(item => item.timestamp + this.duration > Date.now());
    const outTimeKeys = keys.slice(0, index);
    for (let key of outTimeKeys) {
      this.data.delete(key);
    }
  }
}
