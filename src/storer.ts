export default abstract class Storer {
  abstract async register(key: string, limits: number): Promise<void>;

  abstract async getList(key: string): Promise<any[]>;

  abstract async add(key: string, data: any): Promise<boolean>;

  abstract async cleanTimeout(key: string, time?: number): Promise<void>;

  abstract async setDuration(duration: number): Promise<void>;
  abstract async clean(key:string):Promise<void>;
}
