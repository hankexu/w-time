'use strict';

import { EventEmitter } from 'events';
import Storer from './storer';
import { Options } from './interface';
import MemoryStorer from './memoryStorer';
import RedisStorer from './redisStorer';

class TimeWindow extends EventEmitter {
  /**
   *
   * @param duration time duration, ms
   * @param limits  maximum
   */
  private duration: number;
  private storer: Storer;

  constructor(duration: number, option: Options = {
    storage: 'memory',
  }) {
    super();
    this.duration = duration;
    if (option.storage === 'redis') {
      this.storer = new RedisStorer(duration, option);
    } else {
      this.storer = new MemoryStorer(duration);
    }
  }

  async register(key: string, limits: number) {
    await this.storer.register(key, limits);
  }

  async add(key: string, data: any) {
    const overflow = await this.storer.add(key, data);
    if (overflow) {
      this.emit('overflow', key, await this.storer.getList(key));
    }
  }
}

export = TimeWindow;
