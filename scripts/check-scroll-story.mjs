import { mkdir, writeFile } from 'node:fs/promises';

const pages = await (await fetch('http://127.0.0.1:9222/json')).json();
const page = pages.find(page => page.type === 'page');
const ws = new WebSocket(page.webSocketDebuggerUrl);
await new Promise(resolve => ws.addEventListener('open', resolve, { once: true }));
const pending = new Map();
const errors = [];
let id = 0;
ws.addEventListener('message', event => {
  const message = JSON.parse(event.data);
  if (message.id) {
    const handler = pending.get(message.id);
    pending.delete(message.id);
    message.error ? handler.reject(message.error) : handler.resolve(message.result);
  }
  if (message.method === 'Runtime.exceptionThrown') errors.push(message.params);
  if (message.method === 'Runtime.consoleAPICalled' && message.params.type === 'error') errors.push(message.params);
});
function send(method, params = {}) {
  return new Promise((resolve, reject) => {
    pending.set(++id, { resolve, reject });
    ws.send(JSON.stringify({ id, method, params }));
  });
}
async function evaluate(expression) {
  const response = await send('Runtime.evaluate', { expression, returnByValue: true, awaitPromise: true });
  if (response.exceptionDetails) throw new Error(JSON.stringify(response.exceptionDetails));
  return response.result.value;
}
const pause = ms => new Promise(resolve => setTimeout(resolve, ms));
const assert = (condition, message) => { if (!condition) throw new Error(message); };
await mkdir('artifacts/scroll', { recursive: true });
async function screenshot(name) {
  const result = await send('Page.captureScreenshot', { format: 'png' });
  await writeFile(`artifacts/scroll/${name}.png`, Buffer.from(result.data, 'base64'));
}
async function waitForScene() {
  for (let i = 0; i < 60; i++) {
    if (await evaluate("!!document.querySelector('.scroll-intro') && !document.querySelector('.deki-preloader')")) return;
    await pause(1000);
  }
  throw new Error('3D loader did not finish');
}
async function scrollToProgress(progress) {
  await evaluate(`window.scrollTo({top: (document.querySelector('.scroll-intro').offsetHeight - document.querySelector('.intro-sticky-frame').offsetHeight) * ${progress}, behavior:'instant'})`);
  await pause(800);
  return evaluate(`(async () => {
    const rect = document.querySelector('.intro-sticky-frame').getBoundingClientRect();
    const copy = document.querySelector('.story-copy').getBoundingClientRect();
    return {progress: +(document.querySelector('.scroll-intro').dataset.scrollProgress || 0), stickyTop: rect.top, stickyHeight: rect.height,
      about: getComputedStyle(document.querySelector('.story-about')).visibility,
      copyOpacity: +getComputedStyle(document.querySelector('.story-copy')).opacity,
      copyBottom: copy.bottom, viewport: innerHeight,
      overflow: document.documentElement.scrollWidth > document.documentElement.clientWidth,
      failed: document.documentElement.classList.contains('three-unavailable')};
  })()`);
}
try {
  await send('Runtime.enable');
  await send('Page.enable');
  await send('Emulation.setDeviceMetricsOverride', { width: 1440, height: 1000, deviceScaleFactor: 1, mobile: false });
  await send('Page.navigate', { url: 'http://127.0.0.1:5173/' });
  await waitForScene();
  await send('Emulation.setEmulatedMedia', { features: [{ name: 'prefers-reduced-motion', value: 'no-preference' }] });
  await pause(300);
  for (const progress of [0, 0.3, 0.85, 0]) {
    const state = await scrollToProgress(progress);
    console.log('desktop', progress, state);
    assert(!state.failed && !state.overflow, 'Desktop 3D failed or horizontal overflow');
    assert(Math.abs(state.progress - progress) < 0.03, 'Scroll progress does not match');
    assert(Math.abs(state.stickyTop) < 2, 'Intro is not sticky');
    if (progress === 0.85) assert(state.copyOpacity > 0.99 && state.copyBottom < state.viewport, 'About copy is not fully visible');
    await screenshot(`desktop-${progress}`);
  }
  await send('Emulation.setDeviceMetricsOverride', { width: 390, height: 844, deviceScaleFactor: 1, mobile: false });
  await pause(600);
  const mobile = await scrollToProgress(0.9);
  console.log('mobile', mobile);
  await screenshot('mobile-about');
  assert(!mobile.overflow && mobile.copyBottom <= mobile.viewport, 'Mobile About content is clipped');
  await evaluate("document.querySelector('.story-portrait button').click()");
  assert(await evaluate("document.querySelector('.story-portrait button').getAttribute('aria-pressed') === 'false'"), 'Hologram toggle failed');
  await scrollToProgress(0);
  await screenshot('mobile-hero');
  await send('Input.dispatchMouseEvent', { type: 'mouseWheel', x: 190, y: 400, deltaX: 0, deltaY: 600 });
  await pause(1500);
  assert(await evaluate('window.scrollY > 200'), 'Mouse wheel does not scroll');
  await send('Emulation.setDeviceMetricsOverride', { width: 375, height: 667, deviceScaleFactor: 1, mobile: false });
  await pause(500);
  const short = await evaluate(`({position: getComputedStyle(document.querySelector('.intro-sticky-frame')).position,
    visible: getComputedStyle(document.querySelector('.story-copy')).visibility,
    overflow: document.documentElement.scrollWidth > document.documentElement.clientWidth})`);
  console.log('short mobile', short);
  assert(short.position === 'relative' && short.visible === 'visible' && !short.overflow, 'Small screen fallback failed');
  await evaluate("document.querySelector('.story-about').scrollIntoView({behavior:'instant'})");
  await pause(300);
  await screenshot('short-mobile-about');
  await send('Emulation.setDeviceMetricsOverride', { width: 844, height: 390, deviceScaleFactor: 1, mobile: false });
  await pause(400);
  assert(await evaluate("getComputedStyle(document.querySelector('.intro-sticky-frame')).position === 'relative'"), 'Landscape fallback failed');
  await send('Emulation.setEmulatedMedia', { features: [{ name: 'prefers-reduced-motion', value: 'reduce' }] });
  await pause(500);
  const reduced = await evaluate(`({sticky: getComputedStyle(document.querySelector('.intro-sticky-frame')).position,
    about: getComputedStyle(document.querySelector('.story-about')).visibility,
    opacity: +getComputedStyle(document.querySelector('.story-copy')).opacity})`);
  console.log('reduced motion', reduced);
  assert(reduced.sticky === 'relative' && reduced.about === 'visible' && reduced.opacity === 1, 'Reduced motion content is inaccessible');
  assert(errors.length === 0, `Browser errors: ${JSON.stringify(errors)}`);
  console.log('Scroll story checks passed');
} finally {
  await writeFile('artifacts/scroll/browser-errors.json', JSON.stringify(errors, null, 2));
  ws.close();
}
