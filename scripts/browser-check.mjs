import { writeFile } from 'node:fs/promises';
const pages = await (await fetch('http://127.0.0.1:9222/json')).json();
const page = pages.find(p => p.type === 'page');
const ws = new WebSocket(page.webSocketDebuggerUrl);
await new Promise(resolve => ws.addEventListener('open', resolve, { once: true }));
let id = 0;
const pending = new Map();
const errors = [];
ws.addEventListener('message', event => {
  const response = JSON.parse(event.data);
  if (response.id) {
    const handler = pending.get(response.id);
    pending.delete(response.id);
    response.error ? handler.reject(response.error) : handler.resolve(response.result);
  }
  if (response.method === 'Runtime.exceptionThrown' || response.method === 'Log.entryAdded' && response.params.entry.level === 'error') errors.push(response.params);
  if (response.method === 'Runtime.consoleAPICalled' && response.params.type === 'error') errors.push(response.params);
});
function send(method, params = {}) {
  return new Promise((resolve, reject) => {
    pending.set(++id, { resolve, reject });
    ws.send(JSON.stringify({ id, method, params }));
  });
}
const evaluate = async expression => (await send('Runtime.evaluate', { expression, returnByValue: true, awaitPromise: true })).result.value;
await send('Runtime.enable');
await send('Log.enable');
await send('Page.enable');
await send('Emulation.setDeviceMetricsOverride', { width: 1440, height: 1000, deviceScaleFactor: 1, mobile: false });
await send('Page.navigate', { url: 'http://127.0.0.1:5173/' });
for (let attempt = 0; attempt < 60; attempt++) {
  await new Promise(resolve => setTimeout(resolve, 1000));
  if (await evaluate("!!document.querySelector('.deki-canvas') && !document.querySelector('.deki-preloader')")) break;
}
console.log('desktop', await evaluate("JSON.stringify({ title: document.title, failed: document.documentElement.classList.contains('three-unavailable'), loader: !!document.querySelector('.deki-preloader'), overflow: document.documentElement.scrollWidth > innerWidth, stages: [...document.querySelectorAll('[data-scene]')].map(e => ({scene:e.dataset.scene,width:e.clientWidth,height:e.clientHeight})) })"));
await send('Page.captureScreenshot', { format: 'png' }).then(r => writeFile('artifacts/desktop.png', Buffer.from(r.data, 'base64')));
await send('Input.dispatchMouseEvent', { type: 'mousePressed', x: 990, y: 380, button: 'left', clickCount: 1 });
await send('Input.dispatchMouseEvent', { type: 'mouseReleased', x: 990, y: 380, button: 'left', clickCount: 1 });
await new Promise(resolve => setTimeout(resolve, 1800));
console.log('monitor interaction', await evaluate("JSON.stringify({scrollY, message: document.querySelector('.deki-toast')?.textContent})"));
await evaluate("document.querySelector('#about').scrollIntoView({behavior:'instant'})");
await new Promise(resolve => setTimeout(resolve, 1500));
await send('Page.captureScreenshot', { format: 'png' }).then(r => writeFile('artifacts/hologram.png', Buffer.from(r.data, 'base64')));
await evaluate("document.querySelector('.hologram-toggle').click()");
console.log('hologram toggle', await evaluate("document.querySelector('.hologram-toggle').getAttribute('aria-pressed')"));
await new Promise(resolve => setTimeout(resolve, 800));
await send('Page.captureScreenshot', { format: 'png' }).then(r => writeFile('artifacts/clay.png', Buffer.from(r.data, 'base64')));
await evaluate("document.querySelector('.deki-contact-scene').scrollIntoView({behavior:'instant'})");
await new Promise(resolve => setTimeout(resolve, 800));
await send('Page.captureScreenshot', { format: 'png' }).then(r => writeFile('artifacts/contact.png', Buffer.from(r.data, 'base64')));
await send('Emulation.setDeviceMetricsOverride', { width: 390, height: 844, deviceScaleFactor: 1, mobile: true });
await evaluate("window.scrollTo({top:0,behavior:'instant'})");
await new Promise(resolve => setTimeout(resolve, 1500));
console.log('mobile', await evaluate("JSON.stringify({overflow: document.documentElement.scrollWidth > document.documentElement.clientWidth, width: innerWidth, layoutWidth: document.documentElement.clientWidth})"));
await send('Page.captureScreenshot', { format: 'png' }).then(r => writeFile('artifacts/mobile.png', Buffer.from(r.data, 'base64')));
await writeFile('artifacts/browser-errors.json', JSON.stringify(errors, null, 2));
console.log('browser errors', JSON.stringify(errors));
ws.close();
