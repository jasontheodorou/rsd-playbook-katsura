// The participation model in 2.5D: four rings as white bands on the page, one inside the next,
// with the hand, speech bubbles, pencils and flower standing on them as white cut-outs.
// It tilts a little up and down when dragged, and never draws outside its own box.
// The drawings and data are made in ~/svg/landscape (tools/prepare-tpm.mjs) and copied here:
// public/illustrations/participation/ and data.json. This file is a copy of src/participation/scene.ts there.
import * as THREE from 'three';
import { SVGLoader } from 'three/examples/jsm/loaders/SVGLoader.js';
import data from './data.json';

export type StageId = 'engage' | 'involve' | 'collaborate' | 'grow';

const INK = 0x333333;
/** The orange of the published model's accents. */
const ORANGE = 0xe8692c;
/** The bands' edges, seen when tilted. */
const SIDE = 0xe9e5de;
/** World units per drawing unit. */
const U = 1 / 100;
const { cx: CX, cy: CY, sin: SIN } = data.plan;
const COS = Math.sqrt(1 - SIN * SIN);
/** The drawing's own viewing angle, in degrees above the rings. */
const ELEVATION = (Math.asin(SIN) * 180) / Math.PI;
const DISTANCE = 40;
/** Where the drawings live. */
export const ART = '/illustrations/participation';
/** The first-view pulses' blue (katsura's sky), as on the Design Landscape. */
const SKY = 0x619cba;
/** How far a drag tilts the model up and down, in degrees from the drawing's angle. */
const TILT = [-2.5, 4];
/** How far the bands stand off the page. */
const BAND = 0.05;
/** How wide a break in each drawing's line still counts as closed when filling it white, in texture pixels
 *  (12 per drawing unit). The palm is open between thumb and fingers, and the back bubble stops short of the front one. */
const CLOSE_GAP: Record<StageId, number> = { engage: 40, involve: 36, collaborate: 8, grow: 8 };

/** How long a drawing takes to rise a little and settle after a click, in milliseconds. */
const LIFT_MS = 700;
/** A name popping up over its drawing: its letters with where each settles, and the bubbles round it. */
type Pop = {
  group: THREE.Group; t0: number;
  letters: { mesh: THREE.Mesh; x: number; y: number; rot: number; delay: number }[];
  bubbles: { mesh: THREE.Mesh; at: THREE.Vector2; drift: number; rise: number; delay: number }[];
};
/** How long a name's pop-up lasts, from popping in to fading away. */
const POP_MS = 2000;

/** A point on the ground, from drawing units. */
const ground = (sx: number, sy: number, y = 0) => new THREE.Vector3((sx - CX) * U, y, ((sy - CY) / SIN) * U);

export type Box = { x0: number; y0: number; x1: number; y1: number };

/**
 * Loads a drawing and fills every area its ink encloses with white, including areas closed off by
 * another part of the drawing. Breaks in a line up to R pixels across count as closed.
 */
function filledTexture(url: string, R: number, aniso: number): Promise<THREE.Texture> {
  return new Promise((resolve) => {
    const img = new Image();
    img.onload = () => {
      // worked out with a margin all round, so a line near the image's edge cannot wall off the outside
      const M = R + 4, W0 = img.naturalWidth, H0 = img.naturalHeight, w = W0 + 2 * M, h = H0 + 2 * M, n = w * h;
      const c = document.createElement('canvas'); c.width = w; c.height = h;
      const ctx = c.getContext('2d', { willReadFrequently: true })!; ctx.drawImage(img, M, M, W0, H0);
      const image = ctx.getImageData(0, 0, w, h), px = image.data;
      const solid = new Uint8Array(n); for (let i = 0; i < n; i++) solid[i] = px[i * 4 + 3] > 20 ? 1 : 0;
      // distance from a set of pixels, in pixels (two-pass chamfer)
      const distFrom = (set: Uint8Array) => {
        const d = new Float32Array(n); for (let i = 0; i < n; i++) d[i] = set[i] ? 0 : 1e9;
        const E = Math.SQRT2;
        for (let y = 0; y < h; y++) for (let x = 0; x < w; x++) { const i = y * w + x; let v = d[i];
          if (x > 0) v = Math.min(v, d[i - 1] + 1); if (y > 0) { v = Math.min(v, d[i - w] + 1); if (x > 0) v = Math.min(v, d[i - w - 1] + E); if (x < w - 1) v = Math.min(v, d[i - w + 1] + E); } d[i] = v; }
        for (let y = h - 1; y >= 0; y--) for (let x = w - 1; x >= 0; x--) { const i = y * w + x; let v = d[i];
          if (x < w - 1) v = Math.min(v, d[i + 1] + 1); if (y < h - 1) { v = Math.min(v, d[i + w] + 1); if (x < w - 1) v = Math.min(v, d[i + w + 1] + E); if (x > 0) v = Math.min(v, d[i + w - 1] + E); } d[i] = v; }
        return d;
      };
      // close the breaks, then flood in from the edges: what the flood cannot reach is inside
      const near = distFrom(solid), out = new Uint8Array(n), stack: number[] = [];
      const seed = (i: number) => { if (!out[i] && near[i] > R) { out[i] = 1; stack.push(i); } };
      for (let x = 0; x < w; x++) { seed(x); seed((h - 1) * w + x); }
      for (let y = 0; y < h; y++) { seed(y * w); seed(y * w + w - 1); }
      while (stack.length) { const i = stack.pop()!, x = i % w;
        if (x > 0) seed(i - 1); if (x < w - 1) seed(i + 1); if (i >= w) seed(i - w); if (i < n - w) seed(i + w); }
      // give back the band the closing took from the outside, so no white shows beyond the outline
      const fromOut = distFrom(out);
      for (let i = 0; i < n; i++) if (!solid[i] && fromOut[i] > R + 1) px.fill(255, i * 4, i * 4 + 4);
      ctx.putImageData(image, 0, 0);
      const crop = document.createElement('canvas'); crop.width = W0; crop.height = H0;
      crop.getContext('2d')!.drawImage(c, M, M, W0, H0, 0, 0, W0, H0);
      const t = new THREE.CanvasTexture(crop); t.colorSpace = THREE.SRGBColorSpace; t.anisotropy = aniso;
      resolve(t);
    };
    img.src = url;
  });
}

/** A cut-out: its picture (or, for an accent layer, a flat colour through the picture's shape), mixed towards white as it fades. */
function cutout(tint: THREE.Color | null): THREE.ShaderMaterial {
  return new THREE.ShaderMaterial({
    uniforms: { map: { value: null }, tint: { value: tint ?? new THREE.Color() }, useTint: { value: tint ? 1 : 0 }, fade: { value: 0 } },
    vertexShader: 'varying vec2 vUv; void main() { vUv = uv; gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0); }',
    // the picture is read as sRGB and written straight out, so its colours stay as drawn
    fragmentShader: `uniform sampler2D map; uniform vec3 tint; uniform float useTint; uniform float fade; varying vec2 vUv;
      void main() { vec4 t = texture2D(map, vUv); if (t.a < 0.04) discard; vec3 c = mix(t.rgb, tint, useTint); gl_FragColor = vec4(mix(c, vec3(1.0), fade), t.a); }`,
    transparent: true,
  });
}

/** How far a stage fades back while another is pointed at: towards white. */
const FADED = 0.72;

interface Stage { id: StageId; plane: THREE.Mesh; mats: THREE.ShaderMaterial[]; flat: THREE.MeshBasicMaterial[]; base: Record<number, THREE.Color>; fade: number; target: number }

export class ParticipationScene {
  private renderer: THREE.WebGLRenderer;
  private camera = new THREE.PerspectiveCamera(10, 1, 1, 200);
  private scene = new THREE.Scene();
  private uprights: { id: StageId; group: THREE.Group; h: number; x0: number; x1: number; rest: THREE.Vector3 }[] = [];
  /** Each step's name, for the pop-up over its drawing. */
  names: Partial<Record<StageId, string>> = {};
  private pops = new Map<StageId, Pop>();
  /** The font for the names that pop up (Inter). */
  nameFont = "'Inter', system-ui, sans-serif";
  /** The small action each drawing is playing after a click: when it started. */
  private playing = new Map<StageId, number>();
  private stages = new Map<StageId, Stage>();
  private bands: THREE.Mesh[] = [];
  /** Called when the pointer moves onto a different stage's drawing or band, or off them all. */
  onHover?: (s: StageId | null) => void;
  private tilt = 0;
  private stopped = false;
  private resizer!: ResizeObserver;
  private dirty = true;
  /** Pixels kept free round the model inside the canvas: the soft wash sits in this space. */
  margin = { top: 24, side: 48, bottom: 24 };
  /** Called with the canvas height whenever the framing is worked out again. */
  onHeight?: (h: number) => void;

  constructor(private host: HTMLElement) {
    this.renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    this.renderer.setClearColor(0xffffff, 0); // clear, so the wash behind shows through
    this.renderer.outputColorSpace = THREE.SRGBColorSpace;
    const canvas = this.renderer.domElement;
    canvas.setAttribute('aria-hidden', 'true');
    host.appendChild(canvas);

    this.buildBands();
    this.buildUprights();
    this.buildPulses();
    void this.loadGround();
    this.bindDrag(canvas);
    this.resizer = new ResizeObserver(() => this.fit()); this.resizer.observe(host);
    let last = performance.now();
    const loop = (now: number) => {
      if (this.stopped) return;
      this.ease(Math.min(0.1, (now - last) / 1000)); last = now;
      this.act(now);
      this.runPops(now);
      this.animatePulses(now);
      if (this.dirty) { this.dirty = false; this.place(this.camera, this.tilt); this.renderer.render(this.scene, this.camera); }
      requestAnimationFrame(loop);
    };
    requestAnimationFrame(loop);
  }

  // ---------------- the model ----------------
  /** Each band runs from its ring's line to the next ring in, standing a little off the page. */
  private buildBands(): void {
    const outline = (k: number) => {
      const e = data.rings[k].ellipse;
      // half a line's width outside the drawn line, so the line sits wholly on its band
      return data.rings[k].outline.map(([px, py]) => {
        const sx = px + CX, sy = py * SIN + CY, dx = sx - e.cx, dy = sy - e.cy, n = Math.hypot(dx, dy) || 1;
        return new THREE.Vector2((sx + (dx / n) * 2.6 - CX) * U, -(((sy + (dy / n) * 2.6 - CY) / SIN) * U));
      });
    };
    const top = new THREE.MeshBasicMaterial({ color: 0xffffff, polygonOffset: true, polygonOffsetFactor: 1, polygonOffsetUnits: 1 });
    const side = new THREE.MeshBasicMaterial({ color: SIDE });
    for (let k = 0; k < 4; k++) {
      const shape = new THREE.Shape(outline(k));
      if (k < 3) shape.holes.push(new THREE.Path(outline(k + 1)));
      const mesh = new THREE.Mesh(new THREE.ExtrudeGeometry(shape, { depth: BAND + k * 0.0004, bevelEnabled: false, curveSegments: 1 }), [top, side]);
      mesh.rotation.x = -Math.PI / 2; // shape x, y -> world x, -z; depth -> world up
      mesh.userData.stage = (['engage', 'involve', 'collaborate', 'grow'] as StageId[])[k];
      this.scene.add(mesh); this.bands.push(mesh);
    }
  }

  /** The drawings stand upright on their bands, facing the viewer, white inside with orange accents. */
  private buildUprights(): void {
    const aniso = this.renderer.capabilities.getMaxAnisotropy();
    for (const ic of data.icons) {
      const id = ic.stage as StageId;
      const w = (ic.x1 - ic.x0) * U, h = ((ic.y1 - ic.y0) * U) / COS, below = ((ic.y1 - ic.base) * U) / COS;
      const geo = new THREE.PlaneGeometry(w, h); geo.translate(0, h / 2 - below, 0);
      const group = new THREE.Group();
      group.position.copy(ground((ic.x0 + ic.x1) / 2, ic.base, BAND + 0.003));
      const ink = cutout(null), mats = [ink];
      const plane = new THREE.Mesh(geo, ink); plane.renderOrder = 2; plane.userData.stage = id; group.add(plane);
      void filledTexture(`${ART}/${id}.svg`, CLOSE_GAP[id], aniso).then((t) => { t.colorSpace = THREE.NoColorSpace; ink.uniforms.map.value = t; this.dirty = true; });
      if (ic.accent) {
        const accent = cutout(new THREE.Color(ORANGE).convertLinearToSRGB());
        accent.uniforms.map.value = new THREE.TextureLoader().load(`${ART}/${id}-accent.svg`, () => { this.dirty = true; });
        const a = new THREE.Mesh(geo, accent); a.position.z = 0.002; a.renderOrder = 3; group.add(a); mats.push(accent);
      }
      this.stages.set(id, { id, plane, mats, flat: [], base: {}, fade: 0, target: 0 });
      this.scene.add(group);
      this.uprights.push({ id, group, h: ((ic.base - ic.y0) * U) / COS, x0: ic.x0, x1: ic.x1, rest: group.position.clone() });
    }
  }

  /** The ring lines, the arrows and the pencils' scribble, flat on the bands. */
  private async loadGround(): Promise<void> {
    const text = await fetch(`${ART}/ground.svg`).then((r) => r.text());
    const flat = new THREE.Group();
    flat.rotation.x = Math.PI / 2; flat.scale.setScalar(U); flat.position.y = BAND + 0.0025; // plan x, y -> world x, z
    for (const p of new SVGLoader().parse(text).paths) {
      const kind = (p.userData?.node as Element).getAttribute('data-kind');
      // Flat ink always shows over the bands; the drawings still stand in front of it.
      const mat = new THREE.MeshBasicMaterial({ color: kind === 'mark' ? ORANGE : INK, side: THREE.DoubleSide, depthTest: false, depthWrite: false });
      const mesh = new THREE.Mesh(new THREE.ShapeGeometry(p.toShapes(), 6), mat);
      mesh.renderOrder = 1;
      flat.add(mesh);
      // arrows and the scribble belong to a stage, and fade with it
      const st = this.stages.get((p.userData?.node as Element).getAttribute('data-stage') as StageId);
      if (st && kind !== 'ring') { st.base[st.flat.length] = mat.color.clone(); st.flat.push(mat); }
    }
    this.scene.add(flat);
    this.dirty = true;
  }

  // ---------------- pointing at a stage ----------------
  /** Fade every stage but this one back towards white; null brings them all back. */
  focus(z: StageId | null): void {
    for (const st of this.stages.values()) st.target = z && st.id !== z ? FADED : 0;
    this.dirty = true;
  }

  /** Move each stage's fade a step towards its target (about a third of a second), or at once for reduced motion. */
  private ease(dt: number): void {
    const instant = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const white = new THREE.Color(0xffffff);
    for (const st of this.stages.values()) {
      if (st.fade === st.target) continue;
      const step = instant ? 1 : dt / 0.35;
      st.fade = st.fade < st.target ? Math.min(st.target, st.fade + step * FADED) : Math.max(st.target, st.fade - step * FADED);
      for (const m of st.mats) m.uniforms.fade.value = st.fade;
      st.flat.forEach((m, i) => m.color.copy(st.base[i]).lerp(white, st.fade));
      this.dirty = true;
    }
  }

  // ---------------- a click lifts the drawing a little and pops its name up ----------------
  /** Start a drawing's action: it rises a little and settles, and its name pops up. */
  play(id: StageId): void {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    this.playing.set(id, performance.now());
    this.exclaim(id);
    this.onPlay?.(id);
    this.dirty = true;
  }

  /** Called when a drawing is clicked, so the page can follow (open its tab). */
  onPlay?: (id: StageId) => void;

  /**
   * The step's name pops up over its drawing as an orange word in Inter: its letters start a little
   * bunched and settle into place along a gentle arc, from the centre out, and a few small hollow
   * orange bubbles rise round it. It holds, then floats up and fades.
   */
  private exclaim(id: StageId): void {
    const name = this.names[id];
    const u = this.uprights.find((x) => x.id === id);
    if (!name || !u) return;
    this.pops.get(id)?.group.removeFromParent();
    const px = 96, font = `800 ${px}px ${this.nameFont}`, colour = '#' + new THREE.Color(ORANGE).getHexString(THREE.SRGBColorSpace);
    const measure = document.createElement('canvas').getContext('2d')!; measure.font = font;
    const H = 0.4;                                  // height of a letter's tile, in world units
    const unit = H / (px * 1.25);                   // world units per canvas pixel
    const track = px * 0.02;
    const advances = [...name].map((ch) => measure.measureText(ch).width + track);
    const total = advances.reduce((a, b) => a + b, 0) - track;
    const group = new THREE.Group();
    group.position.copy(u.rest).add(new THREE.Vector3(0, u.h + 0.08, 0.01));
    const letters: Pop['letters'] = [];
    let x = -total / 2;
    [...name].forEach((ch, i) => {
      const w = measure.measureText(ch).width, c = document.createElement('canvas');
      c.width = Math.ceil(w + 8); c.height = Math.round(px * 1.25);
      const ctx = c.getContext('2d')!; ctx.font = font; ctx.fillStyle = colour; ctx.textBaseline = 'alphabetic';
      ctx.fillText(ch, 4, px * 0.98);
      const tex = new THREE.CanvasTexture(c); tex.colorSpace = THREE.SRGBColorSpace; tex.anisotropy = this.renderer.capabilities.getMaxAnisotropy();
      const mesh = new THREE.Mesh(new THREE.PlaneGeometry(c.width * unit, H), new THREE.MeshBasicMaterial({ map: tex, transparent: true, depthTest: false, depthWrite: false, opacity: 0 }));
      mesh.renderOrder = 6;
      const cx = (x + w / 2) * unit, k = total ? (x + w / 2) / (total / 2) : 0; // -1 at the left end, 1 at the right
      letters.push({ mesh, x: cx, y: H / 2 + 0.03 * (1 - k * k), rot: -0.06 * k, delay: Math.abs(k) * 0.06 });
      x += advances[i];
      group.add(mesh);
    });
    // a few small hollow orange bubbles that rise from round the word, drift a little and fade
    const bubbles: Pop['bubbles'] = [];
    const half = (total * unit) / 2;
    const ring = (() => {
      const c = document.createElement('canvas'); c.width = c.height = 64;
      const g = c.getContext('2d')!; g.strokeStyle = colour; g.lineWidth = 6; g.beginPath(); g.arc(32, 32, 26, 0, Math.PI * 2); g.stroke();
      const t = new THREE.CanvasTexture(c); t.colorSpace = THREE.SRGBColorSpace; return t;
    })();
    const SPOTS = [[-1.05, 0.3, 0.04], [-0.55, 0.95, 0.028], [0.3, 1, 0.034], [0.9, 0.55, 0.026], [1.08, 0.95, 0.022]];
    SPOTS.forEach(([sx, sy, r], i) => {
      const mesh = new THREE.Mesh(new THREE.PlaneGeometry(r * 2, r * 2), new THREE.MeshBasicMaterial({ map: ring, transparent: true, depthTest: false, depthWrite: false, opacity: 0 }));
      mesh.renderOrder = 6;
      const at = new THREE.Vector2(sx * (half + 0.03), H * (0.2 + 0.6 * sy));
      bubbles.push({ mesh, at, drift: (i % 2 ? 1 : -1) * 0.02, rise: 0.09 + 0.06 * sy, delay: 0.035 * i });
      group.add(mesh);
    });
    this.scene.add(group);
    this.pops.set(id, { group, letters, bubbles, t0: performance.now() });
  }

  /** Run the pop-ups: the letters settle, the bubbles rise, then the word floats up and fades. */
  private runPops(now: number): void {
    for (const [id, p] of this.pops) {
      const t = (now - p.t0) / POP_MS;
      if (t >= 1) { p.group.removeFromParent(); this.pops.delete(id); this.dirty = true; continue; }
      const out = t > 0.75 ? (t - 0.75) / 0.25 : 0;
      for (const l of p.letters) {
        const k = Math.min(1, Math.max(0, (t - l.delay) / 0.2)), e = 1 - Math.pow(1 - k, 3);
        l.mesh.position.set(l.x * (0.8 + 0.2 * e), l.y - 0.03 * (1 - e) + 0.05 * out, 0);
        l.mesh.rotation.z = l.rot * e;
        l.mesh.scale.setScalar(k > 0 ? 0.85 + 0.15 * e : 0.0001);
        (l.mesh.material as THREE.MeshBasicMaterial).opacity = Math.min(1, k * 2.5) * (1 - out);
      }
      for (const b of p.bubbles) {
        const d = Math.min(1, Math.max(0, (t - 0.05 - b.delay) / 0.55)), e = 1 - Math.pow(1 - d, 2);
        b.mesh.position.set(b.at.x + b.drift * Math.sin(e * Math.PI), b.at.y + b.rise * e, 0);
        b.mesh.scale.setScalar(0.7 + 0.5 * e);
        (b.mesh.material as THREE.MeshBasicMaterial).opacity = d <= 0 ? 0 : d < 0.15 ? d / 0.15 : 1 - (d - 0.15) / 0.85;
      }
      this.dirty = true;
    }
  }

  private act(now: number): void {
    for (const u of this.uprights) {
      const t0 = this.playing.get(u.id);
      if (t0 === undefined) continue;
      const t = Math.min(1, (now - t0) / LIFT_MS), g = u.group;
      g.position.copy(u.rest); g.rotation.set(0, 0, 0); g.scale.set(1, 1, 1);
      // every drawing simply rises a little and settles (Jason, 2 October 2026: the waving was too goofy)
      if (t < 1) g.position.y += 0.05 * Math.sin(Math.PI * t);
      else this.playing.delete(u.id);
      this.dirty = true;
    }
  }

  // ---------------- first-view pulses ----------------
  private pulses = new THREE.Group();
  private pulseStart = -1;

  /** A soft blue disc under a thin ring at each drawing's foot, as on the Design Landscape. */
  private buildPulses(): void {
    for (const u of this.uprights) {
      for (const ring of [false, true]) {
        const m = new THREE.Mesh(ring ? new THREE.RingGeometry(1 - 3 / 40, 1, 64) : new THREE.CircleGeometry(1, 48),
          new THREE.MeshBasicMaterial({ color: SKY, transparent: true, opacity: 0, depthWrite: false }));
        m.rotation.x = -Math.PI / 2; m.position.set(u.rest.x, BAND + 0.001, u.rest.z); m.renderOrder = 1;
        m.userData.ring = ring;
        this.pulses.add(m);
      }
    }
    this.pulses.visible = false;
    this.scene.add(this.pulses);
  }

  /** The first-view cue: pulses play until the first click. */
  setCue(on: boolean): void {
    this.pulseStart = on && !window.matchMedia('(prefers-reduced-motion: reduce)').matches ? performance.now() : -1;
    this.pulses.visible = this.pulseStart >= 0;
    this.dirty = true;
  }

  private animatePulses(now: number): void {
    if (this.pulseStart < 0) return;
    // the Design Landscape's timing: one pulse after another, 0.35s apart, every 5 seconds; a disc to 26 units and a ring to 40
    const t = ((now - this.pulseStart) / 1000) % 5;
    this.pulses.children.forEach((c, i) => {
      const mesh = c as THREE.Mesh<THREE.BufferGeometry, THREE.MeshBasicMaterial>, idx = Math.floor(i / 2), ring = mesh.userData.ring as boolean;
      const k = Math.min(1, Math.max(0, (t - 0.4 - idx * 0.35) / 1.4)), e = 1 - Math.pow(1 - k, 3);
      const r = ring ? 6 + 34 * e : 4 + 22 * e, peak = ring ? 0.2 : 0.25, top = ring ? 0.9 : 0.28;
      mesh.material.opacity = k <= 0 || k >= 1 ? 0 : k < peak ? (k / peak) * top : top * (1 - (k - peak) / (1 - peak));
      mesh.scale.set(r * U, r * U, 1);
    });
    this.dirty = true;
  }

  // ---------------- camera and framing ----------------
  private place(cam: THREE.PerspectiveCamera, tilt: number): void {
    const el = ((ELEVATION + tilt) * Math.PI) / 180;
    cam.position.set(0, DISTANCE * Math.sin(el), DISTANCE * Math.cos(el));
    cam.up.set(0, 1, 0); cam.lookAt(0, 0, 0); cam.updateMatrixWorld();
  }

  /** Points that mark the model's furthest reach: the outer band, top and bottom, the drawings' tops and the first arrow. */
  private reach(): THREE.Vector3[] {
    const pts: THREE.Vector3[] = [];
    data.rings[0].outline.forEach(([px, py], i) => { if (i % 4 === 0) pts.push(new THREE.Vector3(px * U, 0, py * U), new THREE.Vector3(px * U, BAND, py * U)); });
    for (const u of this.uprights) for (const x of [u.x0, u.x1]) pts.push(ground(x, 0).setZ(u.group.position.z).setY(BAND + u.h));
    pts.push(ground(data.extent.x0, data.arrows[0].y, BAND));
    return pts;
  }

  /** Fit the model, at every tilt, into the canvas width less the side margins, and size the canvas height to hold it. */
  fit(): void {
    const w = this.host.clientWidth;
    if (!w) return;
    const ref = new THREE.PerspectiveCamera(), pts = this.reach();
    let x0 = Infinity, x1 = -Infinity, y0 = Infinity, y1 = -Infinity;
    for (const tilt of [TILT[0], 0, TILT[1]]) {
      this.place(ref, tilt);
      for (const v of pts) {
        const q = v.clone().applyMatrix4(ref.matrixWorldInverse), x = q.x / -q.z, y = q.y / -q.z;
        x0 = Math.min(x0, x); x1 = Math.max(x1, x); y0 = Math.min(y0, y); y1 = Math.max(y1, y);
      }
    }
    const k = (w - 2 * this.margin.side) / (x1 - x0);
    const h = Math.round(k * (y1 - y0) + this.margin.top + this.margin.bottom);
    const left = x0 - this.margin.side / k, top = y1 + this.margin.top / k, n = this.camera.near;
    this.camera.projectionMatrix.makePerspective(left * n, (left + w / k) * n, top * n, (top - h / k) * n, n, this.camera.far);
    this.camera.projectionMatrixInverse.copy(this.camera.projectionMatrix).invert();
    this.renderer.setSize(w, h, false);
    this.onHeight?.(h);
    this.dirty = true;
  }

  /** Called when the tilt changes, so the page can keep the wash centred on the model. */
  onView?: () => void;

  /** The outer ring's box and the box round everything, in the opening view (no tilt), in canvas pixels.
   *  The wash is drawn from this and stays still while the model tilts (Jason, 2 October 2026). */
  restBoxes(): { ring: Box; all: Box } {
    const ref = new THREE.PerspectiveCamera(); this.place(ref, 0);
    const c = this.renderer.domElement, w = c.clientWidth, h = c.clientHeight;
    const px = (v: THREE.Vector3) => { const p = v.clone().applyMatrix4(ref.matrixWorldInverse).applyMatrix4(this.camera.projectionMatrix); return { x: ((p.x + 1) / 2) * w, y: ((1 - p.y) / 2) * h }; };
    const box = (p: { x: number; y: number }[]): Box => ({ x0: Math.min(...p.map((q) => q.x)), y0: Math.min(...p.map((q) => q.y)), x1: Math.max(...p.map((q) => q.x)), y1: Math.max(...p.map((q) => q.y)) });
    const ring = box(data.rings[0].outline.map(([x, z]) => px(new THREE.Vector3(x * U, BAND, z * U))));
    const all = box([...this.reach().map(px)]);
    return { ring, all };
  }

  // ---------------- dragging tilts it a little ----------------
  private bindDrag(canvas: HTMLCanvasElement): void {
    canvas.style.cursor = 'grab';
    const ray = new THREE.Raycaster();
    /** What is under the pointer: a drawing, or a stage's part of the rings. */
    const under = (e: PointerEvent, drawingsOnly: boolean): StageId | null => {
      const r = canvas.getBoundingClientRect();
      ray.setFromCamera(new THREE.Vector2(((e.clientX - r.left) / r.width) * 2 - 1, -((e.clientY - r.top) / r.height) * 2 + 1), this.camera);
      const planes = [...this.stages.values()].map((s) => s.plane);
      const hit = ray.intersectObjects(drawingsOnly ? planes : [...planes, ...this.bands], false)[0];
      return (hit?.object.userData.stage as StageId) ?? null;
    };
    let hovered: StageId | null = null;
    let down: { x: number; y: number; tilt: number; moved: boolean } | null = null;
    canvas.addEventListener('pointermove', (e) => {
      if (down) {
        // a drag of more than a few pixels tilts the model; less than that is still a click
        if (!down.moved && Math.hypot(e.clientX - down.x, e.clientY - down.y) > 4) { down.moved = true; canvas.setPointerCapture(e.pointerId); canvas.style.cursor = 'grabbing'; }
        if (down.moved) { this.tilt = Math.min(TILT[1], Math.max(TILT[0], down.tilt + (e.clientY - down.y) * 0.08)); this.dirty = true; this.onView?.(); }
        return;
      }
      canvas.style.cursor = under(e, true) ? 'pointer' : 'grab';
      const z = under(e, false);
      if (z !== hovered) { hovered = z; this.onHover?.(z); }
    });
    canvas.addEventListener('pointerleave', () => { if (hovered) { hovered = null; this.onHover?.(null); } });
    canvas.addEventListener('pointerdown', (e) => { down = { x: e.clientX, y: e.clientY, tilt: this.tilt, moved: false }; });
    canvas.addEventListener('pointerup', (e) => {
      if (down && !down.moved) { const z = under(e, true); if (z) this.play(z); }
      down = null; canvas.style.cursor = 'grab';
    });
    canvas.addEventListener('pointercancel', () => { down = null; canvas.style.cursor = 'grab'; });
  }

  /** Stop drawing and let go of the canvas and its memory (when the page is left). */
  destroy(): void {
    this.stopped = true; this.resizer.disconnect();
    this.scene.traverse((o) => { const m = o as THREE.Mesh; m.geometry?.dispose(); for (const mat of [m.material].flat()) (mat as THREE.Material | undefined)?.dispose(); });
    this.renderer.dispose(); this.renderer.domElement.remove();
  }

  /** For checks: hold a tilt. */
  setTilt(t: number): void { this.tilt = t; this.dirty = true; this.onView?.(); }
}
