import os from 'node:os';
import { writeFile } from 'node:fs/promises';
const url = process.env.PREVIEW_URL || 'http://127.0.0.1:5174/';
const pages = await (await fetch('http://127.0.0.1:9222/json')).json();
const page = pages.find(p => p.type === 'page');
const ws = new WebSocket(page.webSocketDebuggerUrl);
await new Promise(resolve => ws.addEventListener('open', resolve, { once: true }));
let id = 0;
const pending = new Map();
const errors = [];
ws.addEventListener('message', event => {
  const data = JSON.parse(event.data);
  if (data.id) {
    const p = pending.get(data.id); pending.delete(data.id);
    data.error ? p.reject(data.error) : p.resolve(data.result);
  }
  if (data.method === 'Runtime.exceptionThrown') errors.push(data.params.exceptionDetails);
  if (data.method === 'Runtime.consoleAPICalled' && data.params.type === 'error') errors.push(data.params.args);
});
function send(method, params = {}) {
  return new Promise((resolve, reject) => {
    pending.set(++id, { resolve, reject }); ws.send(JSON.stringify({ id, method, params }));
  });
}
async function evaluate(expression) {
  const response = await send('Runtime.evaluate', { expression, returnByValue: true, awaitPromise: true });
  if (response.exceptionDetails) throw new Error(JSON.stringify(response.exceptionDetails));
  return response.result.value;
}
try {
  await send('Runtime.enable'); await send('Page.enable');
  await send('Emulation.setDeviceMetricsOverride', { width: 1440, height: 1000, deviceScaleFactor: 1, mobile: false });
  await send('Page.navigate', { url });
  let ready = false;
  for (let i = 0; i < 60; i++) {
    await new Promise(resolve => setTimeout(resolve, 1000));
    ready = await evaluate("!!document.querySelector('.deki-canvas') && !document.querySelector('.deki-preloader')");
    if (ready) break;
  }
  if (!ready || await evaluate("document.documentElement.classList.contains('three-unavailable')")) throw new Error('3D scene did not initialize');
  const result = await evaluate(`(async () => {
    const { WorkspaceAnimation, MouseFollower } = await import('/src/three/workspace-animation.ts');
    const { Resources } = await import('/src/three/resources.ts');
    const THREE = await import('/.vite-cache/user-${os.userInfo().username}/deps/three.js');
    const { clone } = await import('/.vite-cache/user-${os.userInfo().username}/deps/three_addons_utils_SkeletonUtils__js.js');
    const resources = await new Resources().load(() => {});
    const model = clone(resources.workspace.scene);
    if (!model.getObjectByName('Mouse_mat') || !model.getObjectByName('PROP_Mouse')) throw new Error('Mouse interaction targets missing');
    const animation = new WorkspaceAnimation(model, resources.workspace.animations);
    const assert = (condition, text) => { if (!condition) throw new Error(text); };
    const vertex = name => {
      model.updateMatrixWorld(true);
      const mesh = model.getObjectByName(name);
      mesh.skeleton.update();
      return mesh.localToWorld(mesh.getVertexPosition(0, new THREE.Vector3()));
    };
    const base = vertex('Chair_caster'), mouse = vertex('Mouse'), seat = vertex('Chair_seat');
    for (let i=0;i<4*60;i++) animation.update(1/60);
    assert(animation.clip === 'wave', 'wave must still be playing while chair turns');
    assert(vertex('Chair_seat').distanceTo(seat)>0.1, 'chair must swivel during wave');
    assert(vertex('Chair_caster').distanceTo(base)<0.001, 'chair base must stay fixed');
    assert(vertex('Mouse').distanceTo(mouse)<0.001, 'mouse must not follow waving hand');
    for (let i=0;i<3*60;i++) animation.update(1/60);
    assert(animation.clip === 'typing', 'wave must transition to typing');
    const hand = model.getObjectByName('mixamorigRightHand');
    const before = hand.getWorldPosition(new THREE.Vector3());
    for (let i=0;i<60;i++) animation.update(1/60);
    model.updateMatrixWorld(true);
    assert(hand.getWorldPosition(new THREE.Vector3()).distanceTo(before)>0.001, 'typing must animate');
    for (let i=0;i<20*60;i++) animation.update(1/60);
    assert(animation.clip === 'typing', 'typing must loop');
    animation.play('wave');
    assert(animation.clip === 'wave', 'wave must replay');
    for(let i=0;i<7*60;i++) animation.update(1/60);
    assert(animation.clip === 'typing', 'replayed wave must return to typing');
    animation.update(1/60,true);
    const frozen = hand.position.clone();
    animation.play('wave'); animation.update(0.1,true);
    assert(animation.clip==='typing' && hand.position.distanceTo(frozen)<1e-6, 'reduced motion must hold typing pose');
    animation.update(1/60,false);
    // Independent contact test: inside mat follows horizontally; outside it releases.
    const root=new THREE.Group(), h=new THREE.Object3D(), m=new THREE.Object3D();
    h.name='mixamorigRightHand';m.name='PROP_Mouse';m.position.set(0,1,0);h.position.set(0,.95,0);
    const mat=new THREE.Mesh(new THREE.BoxGeometry(.4,.01,.4));mat.name='Mouse_mat';mat.position.y=.98;
    root.add(h,m,mat);const follower=new MouseFollower(root);follower.update(true);
    h.position.x=.04;follower.update(true);assert(Math.abs(m.position.x-.04)<1e-6,'mouse must follow contact');
    assert(Math.abs(m.position.y-1)<1e-6,'mouse height must remain on desk');
    h.position.set(1,2,1);follower.update(true);assert(Math.abs(m.position.x-.04)<1e-6,'mouse must release outside bounds');
    follower.reset();follower.update(false);assert(m.position.length()>0 && Math.abs(m.position.x)<1e-6,'wave must reset mouse');
    animation.play('typing',0);
    const mouseStart=vertex('Mouse');
    for(let i=0;i<24;i++) animation.update(1/24);
    const mouseUse1=vertex('Mouse');
    assert(mouseUse1.distanceTo(mouseStart)>.01,'REAL clip first mouse-use interval must move the mouse');
    assert(Math.abs(mouseUse1.y-mouseStart.y)<.001,'REAL mouse must stay on desk');
    for(let i=24;i<100;i++) animation.update(1/24);
    const typingHold=vertex('Mouse');
    for(let i=100;i<130;i++) animation.update(1/24);
    assert(vertex('Mouse').distanceTo(typingHold)<.001,'REAL mouse must stop while typing');
    for(let i=130;i<230;i++) animation.update(1/24);
    const mouseUse2=vertex('Mouse');
    for(let i=230;i<275;i++) animation.update(1/24);
    assert(vertex('Mouse').distanceTo(mouseUse2)>.002,'REAL second mouse-use interval must move the mouse');
    animation.dispose();mat.geometry.dispose();mat.material.dispose();
    return { clips:resources.workspace.animations.map(c=>({name:c.name,duration:c.duration})), checks:'chair sync, fixed base, REAL mouse-use intervals, REAL typing hold, mouse gating, typing loop, wave replay, reduced motion' };
  })()`);
  await evaluate("window.dispatchEvent(new CustomEvent('deki:animation',{detail:'wave'}))");
  await new Promise(resolve => setTimeout(resolve, 1300));
  const shot = await send('Page.captureScreenshot', { format: 'png' });
  await writeFile('artifacts/workspace-wave.png', Buffer.from(shot.data, 'base64'));
  await evaluate("window.dispatchEvent(new CustomEvent('deki:animation',{detail:'typing'}))");
  await new Promise(resolve => setTimeout(resolve, 500));
  const typing = await send('Page.captureScreenshot', { format: 'png' });
  await writeFile('artifacts/workspace-typing.png', Buffer.from(typing.data, 'base64'));
  await send('Emulation.setDeviceMetricsOverride', { width: 390, height: 844, deviceScaleFactor: 1, mobile: true });
  await evaluate("document.querySelector('[data-scene=workspace]').scrollIntoView({behavior:'instant',block:'center'})");
  await new Promise(resolve => setTimeout(resolve, 700));
  const mobile = await send('Page.captureScreenshot', { format: 'png' });
  await writeFile('artifacts/workspace-mobile.png', Buffer.from(mobile.data, 'base64'));
  assertNoErrors();
  console.log(JSON.stringify(result,null,2));
  await writeFile('artifacts/workspace-animation-check.json',JSON.stringify({result,errors},null,2));
} finally { ws.close(); }
function assertNoErrors() { if (errors.length) throw new Error(JSON.stringify(errors)); }
