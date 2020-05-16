const TimeWindow = require('../lib');

const tw = new TimeWindow(10000,{
  storage:'redis',
  durationName:'10s'
});

tw.on('overflow', (key, list) => {
  console.log('overflow', key, JSON.stringify(list));
});


const key = 'xxx';
tw.register(key, 5).then();
setInterval(() => {
  tw.add(key, { foo: 'bar' });
}, 100);


