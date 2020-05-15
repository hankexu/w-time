import {Data} from './interface';

export default abstract class Storer {
  abstract async register(key:string,limits:number):Promise<void>;
  abstract async getList(key:string):Promise<Array<Data>>;
  abstract async add(key: string, data: any):Promise<boolean>;
  abstract  async cleanTimeout(key:string):Promise<void>;
}