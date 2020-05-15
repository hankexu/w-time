import { RedisOptions } from 'ioredis';

export interface Options {
  storage: 'memory' | 'redis',
  namespace?: string,
  client?: RedisOptions
}

export interface Data {
  timestamp: number,
  data: any
}