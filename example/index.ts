// import { RedisOptions,Redis} from '@types/ioredis';
import IORedis from 'ioredis';



let redis = new IORedis();
console.log(redis);
//
// (async ()=>{
//   await redis.set('xx:xx','xxxxxxxxxxx');
//   const ret = await redis.get('xx:xx');
//   console.log(ret);
// })();