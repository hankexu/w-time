const TimeWindow = require('../lib');

const tw = new TimeWindow(10000,{
  storage:'redis',
  durationName:'10s'
});

tw.on('overflow', (key, list) => {
  console.log('overflow', key, JSON.stringify(list));
});


const key = 'xxxfdsjklj';
tw.register(key, 5).then();
setInterval(() => {
  tw.add(key, { foo: Math.random() });
}, 100);


tw.register(key+"222222", 5).then();
setInterval(() => {
  tw.add(key+"222222", { foo: Math.random() });
}, 100);


