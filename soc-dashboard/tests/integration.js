const http = require('http');
const WebSocket = require('ws');

async function wait(ms){ return new Promise(r=>setTimeout(r,ms)); }

(async ()=>{
  console.log('Starting integration test...');
  const server = require('../src/server');

  // Allow server to boot
  await wait(300);

  // Connect WS
  const ws = new WebSocket('ws://localhost:3002');
  let gotMsg = false;

  ws.on('message', (m)=>{
    console.log('WS recv:', m.toString());
    gotMsg = true;
  });

  await new Promise((res, rej)=> ws.on('open', res));

  // create incident
  const post = await new Promise((res, rej)=>{
    const req = http.request({ method:'POST', host:'127.0.0.1', port:3002, path:'/incidents', headers:{'Content-Type':'application/json'} }, (r)=>{
      let b=''; r.on('data',c=>b+=c); r.on('end', ()=>res(JSON.parse(b)));
    });
    req.on('error', rej);
    req.write(JSON.stringify({ title: 'integration-test', severity: 'LOW' }));
    req.end();
  });

  console.log('Create response:', post);

  // wait for ws message
  await wait(500);

  // fetch metrics
  const metrics = await new Promise((res, rej)=>{
    http.get('http://127.0.0.1:3002/metrics', r=>{ let b=''; r.on('data',c=>b+=c); r.on('end', ()=>res(JSON.parse(b))) });
  });

  console.log('Metrics:', metrics);

  if (gotMsg && metrics && metrics.success) {
    console.log('INTEGRATION TEST: PASS');
    process.exit(0);
  }
  console.error('INTEGRATION TEST: FAIL');
  process.exit(2);

})();
