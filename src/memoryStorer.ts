import Storer from './storer';
import { Data } from './interface';

export = class MemoryStorer extends Storer {
  private data: Map<string, Array<Data>> = new Map();
  private limitsMap: Map<string, number> = new Map();
  private readonly duration: number;

  constructor(duration: number) {
    super();
    this.duration = duration;
  }

  async register(key: string, limits: number) {
    this.limitsMap.set(key, limits);
  }

  async add(key: string, data: any): Promise<boolean> {
    if (!this.limitsMap.has(key)) {
      throw new Error('Unregistered key: ' + key);
    }
    const timestamp = Date.now();
    if (this.data.has(key)) {
      // @ts-ignore
      this.data.get(key).push({
        timestamp: timestamp,
        data,
      });
    } else {
      this.data.set(key, new Array({
        timestamp: timestamp,
        data,
      }));
    }
    await this.cleanTimeout(key);
    // @ts-ignore
    return this.data.get(key).length > this.limitsMap.get(key);
  }

  async getList(key: string): Promise<Array<Data>> {
    return this.data.get(key) || [];
  }

  async cleanTimeout(key: string): Promise<void> {
    const list = this.data.get(key);
    if (list && list.length > 0) {
      const index = list.findIndex(item => item.timestamp + this.duration > Date.now());
      if (index !== -1) {
        this.data.set(key, list.slice(-index));
      }
    }
  }
}