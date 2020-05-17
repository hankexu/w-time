import Storer from './storer';
import {Data, Options} from './interface';
import IORedis from 'ioredis';
import {Redis} from 'ioredis';
import {isObjectLike} from 'lodash'

class RedisStorer extends Storer {
    private readonly duration: number;
    private redis: Redis;
    private namespace: string = 'w-time';
    private durationKey: string;
    private durationMap: Map<string, number> = new Map();
    private limitsMap: Map<string, number> = new Map();

    constructor(duration: number, options?: Options) {
        super();
        this.duration = duration;
        if (options?.namespace) {
            this.namespace = options.namespace;
        }
        this.durationKey = `${this.namespace}:${this.duration}`;
        if (options?.durationName) {
            this.durationKey = `${this.namespace}:${options.durationName}`;
        }
        this.redis = new IORedis(options?.client);
        this.durationMap.set(this.durationKey, duration);
    }

    private zSetKey(key: string) {
        return `${this.durationKey}:${key}`;
    }

    async register(key: string, limits: number) {
        this.limitsMap.set(this.zSetKey(key), limits);
    }


    async add(key: string, data: any): Promise<boolean> {
        const zKey = this.zSetKey(key);
        const limits = this.limitsMap.get(zKey) || Number.MAX_VALUE;
        if (typeof data === 'object') {
            data = JSON.stringify(data);
        }
        const now = Date.now();
        await this.redis.zadd(zKey, now, data);
        await this.cleanTimeout(zKey, now);
        const count = await this.redis.zcount(zKey, 0, now);
        return count >= limits;
    }

    async getList(key: string): Promise<Array<Data>> {
        const list = await this.redis.zrangebyscore(this.zSetKey(key), 0, Date.now());
        return list.map(item => {
            let obj;
            try {
                obj = JSON.parse(item);
            } catch (e) {
                obj = item;
            }
            return obj;
        });
    }

    async cleanTimeout(key: string, time: number): Promise<void> {
        await this.redis.zremrangebyscore(key, 0, time - this.duration);
    }
}


export = RedisStorer
