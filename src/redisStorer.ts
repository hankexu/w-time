import Storer from './storer';
import { Data, Options } from './interface';
import IORedis from 'ioredis';
import { Redis } from 'ioredis';

class RedisStorer extends Storer {
  private readonly duration: number;
  private redis: Redis;
  private namespace: string = 'w-time';
  private durationKey: string;

  constructor(duration: number, options?: Options) {
    super();
    this.duration = duration;
    if (options?.namespace) {
      this.namespace = options.namespace;
    }
    this.redis = new IORedis(options?.client);
    console.log(this.redis);
    this.durationKey = `${this.namespace}:${this.duration}`;
    this.redis.set(this.durationKey, duration, 'PX', duration).then(ret=>{
      console.log(ret);
    });
  }

  async register(key: string, limits: number) {
    // this.redis.set();
  }

  async add(key: string, data: any): Promise<boolean> {
    return false;
  }

  async getList(key: string): Promise<Array<Data>> {
    return [];
  }

  async cleanTimeout(key: string): Promise<void> {

  }
}


export = RedisStorer