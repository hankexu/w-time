import { RedisOptions } from 'ioredis';

export interface Options {
  storage: 'memory' | 'redis',
  namespace?: string,
  durationName?:string,
  client?: RedisOptions
}

export interface Data {
  timestamp: number,
  data: any
}