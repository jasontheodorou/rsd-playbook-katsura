// The ecosystem map in 2.5D: katsura's "Focus" map rebuilt as a pop-up model.
// The ground lines lie on the board; buildings, trees, people and the five lines stand up on it.
// Choosing a region fades the rest, washes the region pale blue, parts its breaks and raises its
// line to its name.
import * as THREE from 'three'
import { SVGLoader } from 'three/examples/jsm/loaders/SVGLoader.js'
import data from './data.json'
import { applyView, clampView, DEFAULT_VIEW, fitFrame, type ViewState } from './view'
import { pick, isDrag, type PickCandidate } from './picking'

export type ZoneId = 'individual' | 'service' | 'organisation' | 'community' | 'environment'
export const ORDER: ZoneId[] = ['individual', 'service', 'organisation', 'community', 'environment']
const INNER: Record<ZoneId, ZoneId | null> = {
  individual: null,
  service: 'individual',
  organisation: 'service',
  community: 'organisation',
  environment: 'community',
}

const INK = 0x333333
/** The board is white, like the drawing's own, so it stands out from the page's warm paper. */
const PAPER = 0xffffff
const WASH = { colour: 0x619cba, chosen: 0.12, hover: 0.06 }
/** The part of the drawing framed: the table and room above it for the names (katsura's viewBox). */
export const FRAME = { x0: 30, y0: 22, x1: 926, y1: 426 }
const FADED = 0.2
/** The region lines are drawn shorter than in the drawing, so the names sit nearer the board (Jason, 29 September 2026). */
const LINE_HEIGHT = 0.7
/** The opening angle, in degrees from the shared front-facing view (Jason, 29 September 2026: face forward). */
export const BASE_ANGLE = { turn: 0, tilt: 0 }
/** Each region's very small drift from the opening angle: degrees of turn and tilt, and percent of the board towards the region. */
const DRIFT: Record<ZoneId, { turn: number; tilt: number; x: number; z: number }> = {
  individual: { turn: 1.2, tilt: 0.6, x: -1.2, z: 0 },
  service: { turn: 0.9, tilt: 0.5, x: -0.8, z: 0.2 },
  organisation: { turn: 0.3, tilt: 0.7, x: 0, z: 0.4 },
  community: { turn: -0.6, tilt: 0.4, x: 0.8, z: 0 },
  environment: { turn: -1, tilt: -0.3, x: 0.6, z: -0.6 },
}
/** How long the drift and the return to the opening angle take, in milliseconds. */
const DRIFT_MS = 1400
const RETURN_MS = 900

const { W, D, T } = data.board
const boardToWorld = (bx: number, by: number) => new THREE.Vector3(bx - W / 2, 0, by - D / 2)
const pctToWorld = (x: number, z: number) =>
  new THREE.Vector3((x / 100 - 0.5) * W, 0, (z / 100 - 0.5) * D)

// ---------------- small animation helper ----------------
type Ease = (k: number) => number
const easeOut: Ease = (k) => 1 - Math.pow(1 - k, 3)
const easeInOut: Ease = (k) => (k < 0.5 ? 4 * k * k * k : 1 - Math.pow(-2 * k + 2, 3) / 2)
/** katsura's EASE, cubic-bezier(0.16, 1, 0.3, 1), approximated. */
const expoOut: Ease = (k) => (k >= 1 ? 1 : 1 - Math.pow(2, -10 * k))

class Value {
  value: number
  private from = 0
  private to = 0
  private t0 = 0
  private ms = 0
  private delay = 0
  private ease: Ease = easeOut
  private moving = false
  constructor(
    v: number,
    private apply: (v: number) => void,
  ) {
    this.value = v
    apply(v)
  }
  set(
    to: number,
    ms = 0,
    opts: { delay?: number; ease?: Ease } = {},
    now = performance.now(),
  ): void {
    if (ms <= 0 && !opts.delay) {
      this.moving = false
      this.value = to
      this.apply(to)
      return
    }
    if (!this.moving && to === this.value) return
    this.from = this.value
    this.to = to
    this.t0 = now
    this.ms = Math.max(ms, 1)
    this.delay = opts.delay ?? 0
    this.ease = opts.ease ?? easeOut
    this.moving = true
  }
  tick(now: number): boolean {
    if (!this.moving) return false
    const k = Math.min(1, Math.max(0, (now - this.t0 - this.delay) / this.ms))
    this.value = this.from + (this.to - this.from) * this.ease(k)
    this.apply(this.value)
    if (k >= 1) this.moving = false
    return true
  }
}

interface Upright {
  id: string
  zone: ZoneId
  kind: string
  mesh: THREE.Mesh<THREE.PlaneGeometry, THREE.MeshBasicMaterial>
  w: number
  h: number
  mask?: { w: number; h: number; solid: Uint8Array }
  fade: Value
}
interface Line {
  zone: ZoneId
  mesh: THREE.Mesh<THREE.PlaneGeometry, THREE.MeshBasicMaterial>
  clip: THREE.Plane
  top: THREE.Vector3
  height: number
  grow: Value
}

export interface EcoEvents {
  onChoose: (z: ZoneId | null) => void
  onHover: (z: ZoneId | null) => void
}

export class EcoScene {
  readonly renderer: THREE.WebGLRenderer
  readonly camera = new THREE.PerspectiveCamera(20, 1, 0.1, 200)
  private scene = new THREE.Scene()
  private values: Value[] = []
  private uprights: Upright[] = []
  private lines = new Map<ZoneId, Line>()
  private edges = new Map<ZoneId, Value>() // contour groups, by the zone whose edge they draw
  private details = new Map<ZoneId, Value>() // flat marks, by zone
  private washes = new Map<ZoneId, Value>()
  private bridges: { zone: ZoneId; edge: ZoneId; mat: THREE.MeshBasicMaterial; open: Value }[] = []
  private focusOutline = new Map<ZoneId, THREE.Line>()
  private pulses: THREE.Group
  private pulseStart = -1
  private chosen: ZoneId | null = null
  private hovered: ZoneId | null = null
  /** The camera's current offsets from the opening angle, animated. */
  private pose = { turn: 0, tilt: 0, x: 0, z: 0 }
  private poseValues!: Record<keyof EcoScene['pose'], Value>
  /** Field of view and view shift that keep the whole model in frame at every pose. */
  private fit = { fov: 20, x: 0, y: 0 }
  /** Width over height of everything the framing takes in, so the page can size the map to it. */
  shape = 896 / 404
  /** Where the table's front corners sit in the opening view, in canvas pixels; the page sets this to the text box's edges. */
  private align: { left: number; right: number } | null = null
  /** Canvas height, in pixels, that holds every pose once the front corners are aligned. */
  height = 0
  /** Height of a region's name above the top of its line, in pixels; the page measures it. */
  labelHeight = 0
  /** Called with the canvas height whenever the framing is worked out again. */
  onHeight?: (height: number) => void
  private dirty = true
  readonly reduce = window.matchMedia('(prefers-reduced-motion: reduce)')

  private alive = true
  private observer: ResizeObserver

  /** page: the page colour around the board, read from the page. */
  constructor(
    private host: HTMLElement,
    private events: EcoEvents,
    page = 0xfcfbf8,
  ) {
    this.renderer = new THREE.WebGLRenderer({ antialias: true })
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    this.renderer.setClearColor(page)
    this.renderer.outputColorSpace = THREE.SRGBColorSpace
    this.renderer.localClippingEnabled = true
    const canvas = this.renderer.domElement
    canvas.setAttribute('aria-hidden', 'true')
    host.appendChild(canvas)

    this.buildBoard()
    this.buildUprights()
    this.buildLines()
    this.pulses = this.buildPulses()
    this.poseValues = {
      turn: this.value(0, (v) => {
        this.pose.turn = v
        this.updateCamera()
      }),
      tilt: this.value(0, (v) => {
        this.pose.tilt = v
        this.updateCamera()
      }),
      x: this.value(0, (v) => {
        this.pose.x = v
        this.updateCamera()
      }),
      z: this.value(0, (v) => {
        this.pose.z = v
        this.updateCamera()
      }),
    }
    void this.loadGround()

    this.observer = new ResizeObserver(() => this.resize())
    this.observer.observe(host)
    this.resize()
    this.bindInput(canvas)
    const loop = (now: number) => {
      if (!this.alive) return
      this.tick(now)
      requestAnimationFrame(loop)
    }
    requestAnimationFrame(loop)
  }

  private value(v: number, apply: (v: number) => void): Value {
    const x = new Value(v, (n) => {
      apply(n)
      this.dirty = true
    })
    this.values.push(x)
    return x
  }
  private get ms() {
    return this.reduce.matches ? 0 : 1
  }

  // ---------------- building the model ----------------
  private buildBoard(): void {
    const paper = new THREE.MeshBasicMaterial({ color: PAPER })
    const box = new THREE.Mesh(new THREE.BoxGeometry(W, T, D), paper)
    box.position.y = -T / 2
    this.scene.add(box)
  }

  /** Flat ink on the paper. Fading mixes its colour towards the paper, so overlapping pieces never darken. */
  private inkMaterial(): THREE.MeshBasicMaterial {
    return new THREE.MeshBasicMaterial({ color: INK, depthWrite: false, side: THREE.DoubleSide })
  }

  private async loadGround(): Promise<void> {
    const [groundText, frontText] = await Promise.all([
      fetch(data.ground).then((r) => r.text()),
      fetch(data.front).then((r) => r.text()),
    ])
    const loader = new SVGLoader()
    const flat = new THREE.Group()
    flat.rotation.x = Math.PI / 2 // drawing x -> world x, drawing y -> world z
    flat.position.set(-W / 2, 0.0006, -D / 2)
    this.scene.add(flat)
    // Only the table top: the frame's front and side strokes are cut at the board's front edge.
    const frontEdge = new THREE.Plane(new THREE.Vector3(0, 0, -1), D / 2 + 0.004)

    const edgeMats = new Map<ZoneId, THREE.MeshBasicMaterial[]>()
    const detailMats = new Map<ZoneId, THREE.MeshBasicMaterial[]>()
    for (const p of loader.parse(groundText).paths) {
      const node = p.userData?.node as Element
      const kind = node.getAttribute('data-kind')
      if (kind === 'region') continue
      const zone = node.getAttribute('data-zone') as ZoneId
      const mat = this.inkMaterial()
      if (node.id === 'g0') mat.clippingPlanes = [frontEdge]
      const mesh = new THREE.Mesh(new THREE.ShapeGeometry(p.toShapes(), 6), mat)
      mesh.renderOrder = 2
      flat.add(mesh)
      if (kind === 'contour') {
        const l = edgeMats.get(zone) ?? []
        l.push(mat)
        edgeMats.set(zone, l)
      } else if (kind === 'detail') {
        const l = detailMats.get(zone) ?? []
        l.push(mat)
        detailMats.set(zone, l)
      } else if (kind === 'bridge') {
        const b = {
          zone,
          edge: node.getAttribute('data-edge') as ZoneId,
          mat,
          open: null as unknown as Value,
        }
        b.open = this.value(0, () => this.applyBridge(b))
        this.bridges.push(b)
      }
    }
    // Front face: the frame outline seen through the face's own perspective. Part of the Environment edge.
    const face = new THREE.Group()
    face.position.set(-W / 2, 0, D / 2 + 0.0006)
    face.scale.set(1, -1, 1) // drawing y runs down the face
    const top = new THREE.Plane(new THREE.Vector3(0, -1, 0), 0.004)
    for (const p of loader.parse(frontText).paths) {
      const mat = this.inkMaterial()
      mat.clippingPlanes = [top]
      face.add(new THREE.Mesh(new THREE.ShapeGeometry(p.toShapes(), 6), mat))
      edgeMats.get('environment')?.push(mat)
    }
    this.scene.add(face)

    for (const z of ORDER) {
      const edge = edgeMats.get(z) ?? []
      this.edges.set(
        z,
        this.value(1, (v) => {
          for (const m of edge) setInk(m, v)
          for (const b of this.bridges) if (b.edge === z) this.applyBridge(b)
        }),
      )
      const det = detailMats.get(z) ?? []
      this.details.set(
        z,
        this.value(1, (v) => {
          for (const m of det) setInk(m, v)
        }),
      )
    }

    // Region washes and keyboard focus outlines, from the traced outlines.
    const poly = data.polylines as Record<ZoneId, number[][][]>
    const shapeOf = (pts: number[][]) =>
      new THREE.Shape(pts.map(([x, y]) => new THREE.Vector2(x, y)))
    for (const z of ORDER) {
      const shape = shapeOf(poly[z][0])
      const inner = INNER[z]
      if (inner)
        shape.holes.push(new THREE.Path(poly[inner][0].map(([x, y]) => new THREE.Vector2(x, y))))
      const mat = new THREE.MeshBasicMaterial({
        color: WASH.colour,
        transparent: true,
        opacity: 0,
        depthWrite: false,
        side: THREE.DoubleSide,
      })
      const mesh = new THREE.Mesh(new THREE.ShapeGeometry(shape, 4), mat)
      mesh.position.z = 0.0003 // under the ink (the group is turned, so its z is world -y)
      mesh.renderOrder = 1
      flat.add(mesh)
      this.washes.set(
        z,
        this.value(0, (v) => {
          mat.opacity = v
          mesh.visible = v > 0.001
        }),
      )

      const pts = poly[z][0].map(([x, y]) => new THREE.Vector3(x, y, -0.001))
      const line = new THREE.LineLoop(
        new THREE.BufferGeometry().setFromPoints(pts),
        new THREE.LineDashedMaterial({
          color: 0x16222b,
          dashSize: 0.06,
          gapSize: 0.05,
          transparent: true,
        }),
      )
      line.computeLineDistances()
      line.visible = false
      line.renderOrder = 3
      flat.add(line)
      this.focusOutline.set(z, line)
    }

    this.applyState(true)
  }

  private applyBridge(b: { edge: ZoneId; mat: THREE.MeshBasicMaterial; open: Value }): void {
    // A bridge takes its edge's ink; it is only see-through while it parts or closes.
    setInk(b.mat, this.edges.get(b.edge)?.value ?? 1)
    const open = b.open?.value ?? 0
    if (b.mat.transparent !== open > 0) {
      b.mat.transparent = open > 0
      b.mat.needsUpdate = true
    }
    b.mat.opacity = 1 - open
    b.mat.visible = open < 0.999
  }

  private loadTexture(url: string, onImage?: (img: HTMLImageElement) => void): THREE.Texture {
    const t = new THREE.TextureLoader().load(url, (tex) => {
      onImage?.(tex.image as HTMLImageElement)
      this.dirty = true
    })
    t.colorSpace = THREE.SRGBColorSpace
    t.anisotropy = this.renderer.capabilities.getMaxAnisotropy()
    return t
  }

  private buildUprights(): void {
    const c0 = new THREE.PerspectiveCamera()
    applyView(c0, DEFAULT_VIEW)
    const cam = c0.position
    for (const o of data.objects) {
      const w = (o.width / 100) * W,
        h = (o.height / 100) * W
      const geo = new THREE.PlaneGeometry(w, h)
      geo.translate(0, h / 2, 0)
      const person = o.kind === 'person'
      const mat = new THREE.MeshBasicMaterial({ transparent: true, alphaTest: 0.04 })
      const u: Upright = {
        id: o.id,
        zone: o.zone as ZoneId,
        kind: o.kind,
        mesh: new THREE.Mesh(geo, mat),
        w,
        h,
        fade: null as unknown as Value,
      }
      mat.map = this.loadTexture(o.asset, (img) => {
        if (person) {
          u.mask = buildMask(img)
          return
        }
        // Buildings and trees are solid white inside, trunks and leaves included, so they read
        // as white cut-outs against the blue wash.
        // Trees are drawn open at the bottom of their leaves, so they need wider gaps closed.
        const filled = fillWhite(img, o.kind === 'tree' ? 16 : 6)
        const tex = new THREE.CanvasTexture(filled)
        tex.colorSpace = THREE.SRGBColorSpace
        tex.anisotropy = this.renderer.capabilities.getMaxAnisotropy()
        mat.map = tex
        mat.needsUpdate = true
        u.mask = buildMask(filled)
        this.dirty = true
      })
      const base = pctToWorld(o.x, o.z)
      u.mesh.position.copy(base)
      u.mesh.rotation.y = Math.atan2(cam.x - base.x, cam.z - base.z)
      u.mesh.renderOrder = 4
      // Fading mixes the drawing towards the paper but keeps it solid, like a paler paper cut-out.
      const fade = { value: 1 }
      mat.onBeforeCompile = (sh) => {
        sh.uniforms.uFade = fade
        sh.uniforms.uPaper = { value: new THREE.Color(PAPER) }
        sh.fragmentShader =
          'uniform float uFade; uniform vec3 uPaper;\n' +
          sh.fragmentShader.replace(
            '#include <opaque_fragment>',
            'outgoingLight = mix(uPaper, outgoingLight, uFade);\n#include <opaque_fragment>',
          )
      }
      u.fade = this.value(1, (v) => (fade.value = v))
      this.uprights.push(u)
      this.scene.add(u.mesh)
    }
  }

  private buildLines(): void {
    const c0 = new THREE.PerspectiveCamera()
    applyView(c0, DEFAULT_VIEW)
    for (const l of data.lines) {
      const w = (l.width / 100) * W,
        h = (l.height / 100) * W * LINE_HEIGHT
      const geo = new THREE.PlaneGeometry(w, h)
      // put the line's end point (anchorU, anchorV in the image) at the origin
      geo.translate((0.5 - l.anchorU) * w, (0.5 - l.anchorV) * h, 0)
      const clip = new THREE.Plane(new THREE.Vector3(0, -1, 0), 0)
      const mat = new THREE.MeshBasicMaterial({
        map: this.loadTexture(l.asset),
        transparent: true,
        alphaTest: 0.04,
        clippingPlanes: [clip],
      })
      const mesh = new THREE.Mesh(geo, mat)
      const base = pctToWorld(l.x, l.z)
      mesh.position.copy(base)
      mesh.rotation.y = Math.atan2(c0.position.x - base.x, c0.position.z - base.z)
      mesh.renderOrder = 5
      mesh.visible = false
      this.scene.add(mesh)
      const top = new THREE.Vector3((l.topU - l.anchorU) * w, (l.topV - l.anchorV) * h, 0)
      const height = (l.topV - l.anchorV) * h
      const line: Line = {
        zone: l.zone as ZoneId,
        mesh,
        clip,
        top,
        height,
        grow: null as unknown as Value,
      }
      line.grow = this.value(0, (v) => {
        clip.constant = v * (height + 0.02) - 0.001
        mesh.visible = v > 0.002
      })
      this.lines.set(line.zone, line)
    }
  }

  private buildPulses(): THREE.Group {
    const g = new THREE.Group()
    for (const p of data.pulses) {
      const at = boardToWorld(p.x, p.y)
      const disc = new THREE.Mesh(
        new THREE.CircleGeometry(1, 48),
        new THREE.MeshBasicMaterial({
          color: WASH.colour,
          transparent: true,
          opacity: 0,
          depthWrite: false,
        }),
      )
      const ring = new THREE.Mesh(
        new THREE.RingGeometry(1 - 3 / 40, 1, 64),
        new THREE.MeshBasicMaterial({
          color: WASH.colour,
          transparent: true,
          opacity: 0,
          depthWrite: false,
        }),
      )
      for (const m of [disc, ring]) {
        m.rotation.x = -Math.PI / 2
        m.position.set(at.x, 0.0009, at.z)
        m.renderOrder = 3
        m.userData.unit = p.unit
        g.add(m)
      }
    }
    g.visible = false
    this.scene.add(g)
    return g
  }

  // ---------------- state ----------------
  choose(z: ZoneId | null): void {
    if (z === this.chosen) return
    const prev = this.chosen
    this.chosen = z
    this.applyState(false, prev)
  }

  hover(z: ZoneId | null): void {
    if (z === this.hovered) return
    this.hovered = z
    for (const zz of ORDER)
      if (zz !== this.chosen) this.washes.get(zz)?.set(zz === z ? WASH.hover : 0, 200 * this.ms)
    this.renderer.domElement.style.cursor = z ? 'pointer' : 'default'
  }

  showFocus(z: ZoneId | null): void {
    for (const [k, l] of this.focusOutline) l.visible = k === z
    this.dirty = true
  }

  /** The first-view cue: pulses play until the first choice. */
  setCue(on: boolean): void {
    this.pulseStart = on && !this.reduce.matches ? performance.now() : -1
    this.pulses.visible = this.pulseStart >= 0
    this.dirty = true
  }

  private applyState(instant: boolean, prev: ZoneId | null = null): void {
    const k = instant ? 0 : this.ms
    const z = this.chosen
    const now = performance.now()
    for (const e of ORDER) {
      const edgeOn = z === null || e === z || e === INNER[z]
      this.edges.get(e)?.set(edgeOn ? 1 : FADED, 450 * k, { ease: expoOut }, now)
      this.details.get(e)?.set(z === null || e === z ? 1 : FADED, 450 * k, { ease: expoOut }, now)
      this.washes
        .get(e)
        ?.set(e === z ? WASH.chosen : e === this.hovered ? WASH.hover : 0, 600 * k, {}, now)
    }
    for (const u of this.uprights) {
      u.fade.set(z === null || u.zone === z ? 1 : FADED, 450 * k, { ease: expoOut }, now)
    }
    // The breaks in the ground lines stay closed (Jason, 29 September 2026: parting them distracted);
    // the chosen region's line simply rises.
    // The model drifts very slightly towards the chosen region, and returns to the opening angle when it is let go.
    const d = z ? DRIFT[z] : { turn: 0, tilt: 0, x: 0, z: 0 }
    const ms = (z ? DRIFT_MS : RETURN_MS) * k
    for (const key of ['turn', 'tilt', 'x', 'z'] as const)
      this.poseValues?.[key].set(d[key], ms, { ease: easeInOut }, now)
    for (const [lz, l] of this.lines) {
      if (lz === z) l.grow.set(1, 800 * k, { ease: easeInOut }, now)
      else l.grow.set(0, 450 * k, { ease: (t) => t * t }, now)
    }
  }

  // ---------------- camera ----------------
  private resize(): void {
    const w = this.host.clientWidth,
      h = this.host.clientHeight
    this.renderer.setSize(w, h, false)
    this.camera.aspect = w / h
    this.fit = this.frameAllPoses(w / h)
    this.updateCamera()
    // The height depends on the drawings, which load after the first framing, so report it each time.
    if (this.align) this.onHeight?.(this.height)
  }

  private viewFor(p: { turn: number; tilt: number; x: number; z: number }): ViewState {
    return clampView({
      ...DEFAULT_VIEW,
      x: DEFAULT_VIEW.x + p.x,
      z: DEFAULT_VIEW.z + p.z,
      turn: BASE_ANGLE.turn + p.turn,
      tilt: BASE_ANGLE.tilt + p.tilt,
    })
  }

  private updateCamera(): void {
    const w = this.host.clientWidth,
      h = this.host.clientHeight
    if (!w || !h) return
    this.camera.fov = this.fit.fov
    applyView(this.camera, this.viewFor(this.pose))
    const k = h / (2 * Math.tan((this.fit.fov * Math.PI) / 360))
    this.camera.setViewOffset(w, h, this.fit.x * k, -this.fit.y * k, w, h)
    this.camera.updateProjectionMatrix()
    this.dirty = true
  }

  /**
   * One framing for the opening angle and every region's drift, so nothing is ever cut off and the
   * framing itself never changes: it takes in the board with its front edge, the top of every
   * upright drawing and every line with room for its name.
   */
  private frameAllPoses(aspect: number): { fov: number; x: number; y: number } {
    const pts: THREE.Vector3[] = []
    for (const x of [-W / 2, W / 2])
      for (const z of [-D / 2, D / 2]) for (const y of [0, -T]) pts.push(new THREE.Vector3(x, y, z))
    for (const u of this.uprights)
      for (const sx of [-0.5, 0.5])
        pts.push(
          new THREE.Vector3(sx * u.w, u.h, 0).applyMatrix4(
            u.mesh.matrixWorld.compose(u.mesh.position, u.mesh.quaternion, u.mesh.scale),
          ),
        )
    const tops: THREE.Vector3[] = []
    for (const l of this.lines.values()) {
      l.mesh.updateMatrixWorld()
      tops.push(l.top.clone().applyMatrix4(l.mesh.matrixWorld))
    }
    const cam = new THREE.PerspectiveCamera()
    let x0 = Infinity,
      x1 = -Infinity,
      y0 = Infinity,
      y1 = -Infinity
    const NAME = 0.05 // room above a line's top for its name, in tangent units
    for (const p of [{ turn: 0, tilt: 0, x: 0, z: 0 }, ...ORDER.map((z) => DRIFT[z])]) {
      applyView(cam, this.viewFor(p))
      const inv = cam.matrixWorldInverse.copy(cam.matrixWorld).invert()
      const add = (q: THREE.Vector3, extraTop = 0) => {
        const c = q.clone().applyMatrix4(inv)
        const tx = c.x / -c.z,
          ty = c.y / -c.z
        x0 = Math.min(x0, tx)
        x1 = Math.max(x1, tx)
        y0 = Math.min(y0, ty)
        y1 = Math.max(y1, ty + extraTop)
      }
      for (const q of pts) add(q)
      for (const q of tops) add(q, NAME)
    }
    const MARGIN = 0.02
    this.shape = (x1 - x0) / (y1 - y0)
    if (this.align) {
      // Put the table's front corners, in the opening view, exactly on the given canvas pixels.
      applyView(cam, this.viewFor({ turn: 0, tilt: 0, x: 0, z: 0 }))
      const inv = cam.matrixWorldInverse.copy(cam.matrixWorld).invert()
      const tan = (x: number) => {
        const c = new THREE.Vector3(x, 0, D / 2).applyMatrix4(inv)
        return c.x / -c.z
      }
      const tl = tan(-W / 2),
        tr = tan(W / 2)
      const w = this.host.clientWidth,
        fl = this.align.left / w,
        fr = this.align.right / w
      const halfW = (tr - tl) / (fr - fl) / 2
      const perPx = (2 * halfW) / w
      // Crop to the pixel: the board and its drawings at every pose, and each line with its name only
      // at its own region's pose, where it shows. Nothing is added above; 2px below keeps the front edge's ink.
      let top = -Infinity,
        bottom = Infinity
      for (const [zone, p] of [
        [null, { turn: 0, tilt: 0, x: 0, z: 0 }],
        ...ORDER.map((z) => [z, DRIFT[z]] as const),
      ] as const) {
        applyView(cam, this.viewFor(p))
        const toCam = cam.matrixWorldInverse.copy(cam.matrixWorld).invert()
        const ty = (q: THREE.Vector3) => {
          const c = q.clone().applyMatrix4(toCam)
          return c.y / -c.z
        }
        for (const q of pts) {
          const y = ty(q)
          top = Math.max(top, y)
          bottom = Math.min(bottom, y)
        }
        const l = zone ? this.lines.get(zone) : undefined
        if (l)
          top = Math.max(
            top,
            ty(l.top.clone().applyMatrix4(l.mesh.matrixWorld)) + this.labelHeight * perPx,
          )
      }
      bottom -= 2 * perPx
      this.height = (top - bottom) / perPx
      const halfH = halfW / aspect
      return {
        fov: (2 * Math.atan(halfH) * 180) / Math.PI,
        x: tl - (fl - 0.5) * 2 * halfW,
        y: (top + bottom) / 2,
      }
    }
    const halfH = Math.max((y1 - y0) / 2, (x1 - x0) / 2 / aspect) * (1 + MARGIN)
    return { fov: (2 * Math.atan(halfH) * 180) / Math.PI, x: (x0 + x1) / 2, y: (y0 + y1) / 2 }
  }

  /** Screen positions (CSS px within the canvas) of each line's top, for the names. */
  lineTops(): Map<ZoneId, { x: number; y: number }> {
    const out = new Map<ZoneId, { x: number; y: number }>()
    const w = this.host.clientWidth,
      h = this.host.clientHeight
    for (const [z, l] of this.lines) {
      l.mesh.updateMatrixWorld()
      const p = l.top.clone().applyMatrix4(l.mesh.matrixWorld).project(this.camera)
      out.set(z, { x: ((p.x + 1) / 2) * w, y: ((1 - p.y) / 2) * h })
    }
    return out
  }

  /** Called after each drawn frame, so page labels can follow the model. */
  onFrame?: () => void

  private tick(now: number): void {
    let moving = false
    for (const v of this.values) if (v.tick(now)) moving = true
    if (this.pulseStart >= 0) {
      this.animatePulses(now)
      moving = true
    }
    if (this.dirty || moving) {
      this.renderer.render(this.scene, this.camera)
      this.dirty = false
      this.onFrame?.()
    }
  }

  private animatePulses(now: number): void {
    // Three pulses in turn, 0.35s apart, every 5 seconds: a disc to 26 units and a ring to 40.
    const t = ((now - this.pulseStart) / 1000) % 5
    this.pulses.children.forEach((m, i) => {
      const mesh = m as THREE.Mesh<THREE.BufferGeometry, THREE.MeshBasicMaterial>
      const idx = Math.floor(i / 2),
        isRing = i % 2 === 1
      const k = Math.min(1, Math.max(0, (t - 0.4 - idx * 0.35) / 1.4))
      const e = easeOut(k)
      const r = isRing ? 6 + (40 - 6) * e : 4 + (26 - 4) * e
      const peak = isRing ? 0.2 : 0.25,
        top = isRing ? 0.9 : 0.28
      const op =
        k <= 0 || k >= 1 ? 0 : k < peak ? (k / peak) * top : top * (1 - (k - peak) / (1 - peak))
      mesh.material.opacity = op
      const s = r * (mesh.userData.unit as number)
      mesh.scale.set(s, s, 1)
    })
  }

  // ---------------- picking ----------------
  /** Region under a screen point: an upright drawing takes its own region, else the ground. */
  zoneAt(clientX: number, clientY: number): ZoneId | null {
    const r = this.renderer.domElement.getBoundingClientRect()
    const px = clientX - r.left,
      py = clientY - r.top
    const v = new THREE.Vector3()
    const items: PickCandidate[] = this.uprights.map((u) => {
      u.mesh.updateMatrixWorld()
      let x0 = Infinity,
        y0 = Infinity,
        x1 = -Infinity,
        y1 = -Infinity
      for (const [sx, sy] of [
        [-0.5, 0],
        [0.5, 0],
        [-0.5, 1],
        [0.5, 1],
      ]) {
        v.set(sx * u.w, sy * u.h, 0)
          .applyMatrix4(u.mesh.matrixWorld)
          .project(this.camera)
        const X = ((v.x + 1) / 2) * r.width,
          Y = ((1 - v.y) / 2) * r.height
        x0 = Math.min(x0, X)
        x1 = Math.max(x1, X)
        y0 = Math.min(y0, Y)
        y1 = Math.max(y1, Y)
      }
      return {
        id: u.id,
        rect: { x0, y0, x1, y1 },
        depth: this.camera.position.distanceTo(u.mesh.position),
        reach: 0,
        solidAt: (a: number, b: number) => solidAt(u, a, b),
      }
    })
    // Only a solid part of a drawing counts; empty paper falls through to the ground.
    const onDrawing = items.filter((it, i) => {
      const { x0, y0, x1, y1 } = it.rect
      return (
        px >= x0 &&
        px <= x1 &&
        py >= y0 &&
        py <= y1 &&
        solidAt(this.uprights[i], (px - x0) / (x1 - x0), (py - y0) / (y1 - y0))
      )
    })
    const hit = pick(
      px,
      py,
      onDrawing.map((it) => ({ ...it, solidAt: undefined })),
    )
    if (hit) return this.uprights.find((u) => u.id === hit)!.zone
    const ndc = new THREE.Vector2((px / r.width) * 2 - 1, -(py / r.height) * 2 + 1)
    const ray = new THREE.Raycaster()
    ray.setFromCamera(ndc, this.camera)
    const at = new THREE.Vector3()
    if (!ray.ray.intersectPlane(new THREE.Plane(new THREE.Vector3(0, 1, 0), 0), at)) return null
    const bx = at.x + W / 2,
      by = at.z + D / 2
    if (bx < 0 || bx > W || by < 0 || by > D) return null
    const poly = data.polylines as Record<ZoneId, number[][][]>
    for (const z of ORDER) if (z === 'environment' || insidePoly(poly[z][0], bx, by)) return z
    return null
  }

  // ---------------- input ----------------
  private bindInput(el: HTMLCanvasElement): void {
    let start: { x: number; y: number } | null = null
    let dragged = false
    el.style.cursor = 'default'
    el.addEventListener('pointerdown', (e) => {
      if (e.button !== 0) return
      el.setPointerCapture(e.pointerId)
      start = { x: e.clientX, y: e.clientY }
      dragged = false
    })
    el.addEventListener('pointermove', (e) => {
      const r = el.getBoundingClientRect()
      if (!start) {
        if (e.pointerType === 'mouse') {
          const z = this.zoneAt(e.clientX, e.clientY)
          if (z !== this.hovered) {
            this.hover(z)
            this.events.onHover(z)
          }
        }
        return
      }
      // A pointer that moves too far before release is not a click.
      if (!dragged && isDrag(e.clientX - start.x, e.clientY - start.y)) dragged = true
    })
    const end = (e: PointerEvent) => {
      if (!start) return
      if (!dragged && e.type === 'pointerup')
        this.events.onChoose(this.zoneAt(e.clientX, e.clientY))
      start = null
    }
    el.addEventListener('pointerup', end)
    el.addEventListener('pointercancel', end)
    el.addEventListener('pointerleave', () => {
      if (this.hovered) {
        this.hover(null)
        this.events.onHover(null)
      }
    })
  }

  /** Page position of a point in the drawing (source units) on the board, or of an upright object's middle. For checks. */
  screenOf(target: string | [number, number]): { x: number; y: number } {
    const r = this.renderer.domElement.getBoundingClientRect()
    let p: THREE.Vector3
    if (typeof target === 'string') {
      const u = this.uprights.find((k) => k.id === target)!
      p = u.mesh.position.clone().setY(u.h * 0.4)
    } else {
      const [bx, by] = toBoardFromDrawing(target)
      p = boardToWorld(bx, by)
    }
    p.project(this.camera)
    return { x: r.left + ((p.x + 1) / 2) * r.width, y: r.top + ((1 - p.y) / 2) * r.height }
  }

  /** Stops drawing and frees the GPU memory, when the block leaves the page. */
  dispose(): void {
    this.alive = false
    this.observer.disconnect()
    this.scene.traverse((o) => {
      const m = o as THREE.Mesh
      m.geometry?.dispose()
      const mats = (Array.isArray(m.material) ? m.material : [m.material]).filter(
        Boolean,
      ) as THREE.MeshBasicMaterial[]
      for (const mat of mats) {
        mat.map?.dispose()
        mat.dispose()
      }
    })
    this.renderer.dispose()
    this.renderer.domElement.remove()
  }

  /** The camera's current offsets from the opening angle. For checks. */
  get currentPose() {
    return { ...this.pose }
  }
  /** Line the table's front corners up with two canvas x positions (pixels). */
  setAlign(left: number, right: number): void {
    this.align = { left, right }
    this.resize()
  }
  /** Try an opening angle without reloading. For fitting it to a reference. */
  setBaseAngle(turn: number, tilt: number): void {
    BASE_ANGLE.turn = turn
    BASE_ANGLE.tilt = tilt
    this.resize()
  }
  /** Page positions of the table top's four corners (back left, back right, front right, front left). For checks. */
  cornersOnPage(): { x: number; y: number }[] {
    const r = this.renderer.domElement.getBoundingClientRect()
    return [
      [-1, -1],
      [1, -1],
      [1, 1],
      [-1, 1],
    ].map(([sx, sz]) => {
      const p = new THREE.Vector3((sx * W) / 2, 0, (sz * D) / 2).project(this.camera)
      return { x: r.left + ((p.x + 1) / 2) * r.width, y: r.top + ((1 - p.y) / 2) * r.height }
    })
  }
}

/** Drawing point (source units) to board units, through the flattening used for the ground. */
function toBoardFromDrawing([x, y]: [number, number]): [number, number] {
  const h = data.fromDrawing
  const w = h[6] * x + h[7] * y + h[8]
  return [((h[0] * x + h[1] * y + h[2]) / w) * W, ((h[3] * x + h[4] * y + h[5]) / w) * D]
}

const inkColour = new THREE.Color(INK)
const paperColour = new THREE.Color(PAPER)
/** Ink at a strength from 0 (paper) to 1 (full ink). */
function setInk(m: THREE.MeshBasicMaterial, v: number): void {
  m.color.copy(paperColour).lerp(inkColour, v)
}

function insidePoly(poly: number[][], x: number, y: number): boolean {
  let c = false
  for (let i = 0, j = poly.length - 1; i < poly.length; j = i++) {
    const [xi, yi] = poly[i],
      [xj, yj] = poly[j]
    if (yi > y !== yj > y && x < ((xj - xi) * (y - yi)) / (yj - yi) + xi) c = !c
  }
  return c
}

/**
 * The drawing with its inside filled white. The ink is thickened to close small gaps (such as
 * the open bottom of a tree's leaves), everything the outside cannot reach is filled, and the
 * fill is then thinned back so no white shows beyond the drawn line.
 */
function fillWhite(img: HTMLImageElement, gap = 6): HTMLCanvasElement {
  const W0 = img.width,
    H0 = img.height
  const out = document.createElement('canvas')
  out.width = W0
  out.height = H0
  const ctx = out.getContext('2d')!
  // work on a small grid: 8 source pixels per cell (the drawings are at 16 pixels per unit)
  const R = gap // cells: 6 is about 3 drawing units
  const S = 8,
    P = R + 3,
    iw = Math.ceil(W0 / S),
    ih = Math.ceil(H0 / S),
    w = iw + 2 * P,
    h = ih + 2 * P
  const small = document.createElement('canvas')
  small.width = w
  small.height = h
  const sc = small.getContext('2d', { willReadFrequently: true })!
  sc.drawImage(img, P, P, iw, ih)
  const px = sc.getImageData(0, 0, w, h).data
  const ink = new Uint8Array(w * h)
  for (let i = 0; i < w * h; i++) ink[i] = px[i * 4 + 3] > 60 ? 1 : 0
  const dist = (set: Uint8Array) => {
    // chamfer distance to the nearest cell in the set
    const d = new Float32Array(w * h).fill(1e9)
    for (let i = 0; i < w * h; i++) if (set[i]) d[i] = 0
    for (let y = 0; y < h; y++)
      for (let x = 0; x < w; x++) {
        const i = y * w + x
        if (x > 0) d[i] = Math.min(d[i], d[i - 1] + 1)
        if (y > 0) d[i] = Math.min(d[i], d[i - w] + 1)
        if (x > 0 && y > 0) d[i] = Math.min(d[i], d[i - w - 1] + 1.414)
        if (x < w - 1 && y > 0) d[i] = Math.min(d[i], d[i - w + 1] + 1.414)
      }
    for (let y = h - 1; y >= 0; y--)
      for (let x = w - 1; x >= 0; x--) {
        const i = y * w + x
        if (x < w - 1) d[i] = Math.min(d[i], d[i + 1] + 1)
        if (y < h - 1) d[i] = Math.min(d[i], d[i + w] + 1)
        if (x < w - 1 && y < h - 1) d[i] = Math.min(d[i], d[i + w + 1] + 1.414)
        if (x > 0 && y < h - 1) d[i] = Math.min(d[i], d[i + w - 1] + 1.414)
      }
    return d
  }
  const dInk = dist(ink)
  const wall = new Uint8Array(w * h)
  for (let i = 0; i < w * h; i++) wall[i] = dInk[i] <= R ? 1 : 0
  const outside = new Uint8Array(w * h)
  const stack: number[] = []
  for (let x = 0; x < w; x++) stack.push(x, (h - 1) * w + x)
  for (let y = 0; y < h; y++) stack.push(y * w, y * w + w - 1)
  while (stack.length) {
    const i = stack.pop()!
    if (outside[i] || wall[i]) continue
    outside[i] = 1
    const x = i % w
    if (x > 0) stack.push(i - 1)
    if (x < w - 1) stack.push(i + 1)
    if (i >= w) stack.push(i - w)
    if (i < w * (h - 1)) stack.push(i + w)
  }
  const dOut = dist(outside)
  const fill = sc.createImageData(w, h)
  for (let i = 0; i < w * h; i++)
    if (dOut[i] > R) {
      fill.data[i * 4] = fill.data[i * 4 + 1] = fill.data[i * 4 + 2] = 255
      fill.data[i * 4 + 3] = 255
    }
  sc.clearRect(0, 0, w, h)
  sc.putImageData(fill, 0, 0)
  ctx.imageSmoothingEnabled = true
  ctx.drawImage(small, P, P, iw, ih, 0, 0, W0, H0)
  ctx.drawImage(img, 0, 0)
  return out
}

function buildMask(img: HTMLImageElement | HTMLCanvasElement): Upright['mask'] {
  const size = 48,
    k = size / Math.max(img.width, img.height)
  const w = Math.max(2, Math.round(img.width * k)),
    h = Math.max(2, Math.round(img.height * k))
  const c = document.createElement('canvas')
  c.width = w
  c.height = h
  const ctx = c.getContext('2d', { willReadFrequently: true })!
  ctx.drawImage(img, 0, 0, w, h)
  const px = ctx.getImageData(0, 0, w, h).data
  const solid = new Uint8Array(w * h)
  for (let i = 0; i < w * h; i++) solid[i] = px[i * 4 + 3] > 40 ? 1 : 0
  return { w, h, solid }
}

function solidAt(u: Upright, a: number, b: number): boolean {
  if (!u.mask) return false
  const { w, h, solid } = u.mask
  const x = Math.min(w - 1, Math.max(0, Math.floor(a * w))),
    y = Math.min(h - 1, Math.max(0, Math.floor(b * h)))
  return solid[y * w + x] === 1
}
