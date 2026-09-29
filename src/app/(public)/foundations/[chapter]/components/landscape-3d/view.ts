// Camera maths: the opening view recovered from the drawing, the limits on
// movement, and conversion between a simple "view state" and a camera pose.
import * as THREE from 'three'
import layout from './camera.json'

const cam = layout.camera
export const BOARD_W = cam.W
export const BOARD_D = cam.D
export const BOARD_T = cam.thickness
export const GROUND_MARGIN = cam.margin

/** Board percent (x from left, z from back) to world X/Z. */
export function boardToWorld(x: number, z: number): THREE.Vector3 {
  return new THREE.Vector3((x / 100 - 0.5) * BOARD_W, 0, (z / 100 - 0.5) * BOARD_D)
}

export interface ViewState {
  x: number
  z: number
  zoom: number
  turn: number
  tilt: number
}

export const LIMITS = { zoom: [0.3, 1.15], turn: [-15, 15], tilt: [-8, 12] } as const

// ---- the camera that reproduces the drawing (solved from the board corners) ----
const [r1, r2, t] = [cam.r1, cam.r2, cam.t]
const rY = [
  -(r1[1] * r2[2] - r1[2] * r2[1]),
  -(r1[2] * r2[0] - r1[0] * r2[2]),
  -(r1[0] * r2[1] - r1[1] * r2[0]),
]
const O = new THREE.Vector3(-BOARD_W / 2, 0, -BOARD_D / 2)
const dot = (a: number[], b: number[]) => a[0] * b[0] + a[1] * b[1] + a[2] * b[2]
const centre = new THREE.Vector3(O.x - dot(r1, t), -dot(rY, t), O.z - dot(r2, t))
// OpenCV camera axes (x right, y down, z forward) expressed in world coordinates
const axisFwd = new THREE.Vector3(r1[2], rY[2], r2[2])
const target0 = centre.clone().addScaledVector(axisFwd, -centre.y / axisFwd.y)
const offset0 = centre.clone().sub(target0)
// Opening view fitted to Jason's reference: flatter than the drawing, and a little further back.
const OPEN_ELEVATION = 23.5
const OPEN_DISTANCE = 1.2
const dist0 = offset0.length() * OPEN_DISTANCE
// The drawing is seen from an angle; the opening view faces the board straight on instead.
const az0 = 0
const el0 = (OPEN_ELEVATION * Math.PI) / 180

export const DEFAULT_VIEW: ViewState = {
  x: 50,
  z: (target0.z / BOARD_D + 0.5) * 100,
  zoom: 1,
  turn: 0,
  tilt: 0,
}

// Area of the drawing to frame in the opening view, in source units around the camera centre.
const FRAME_HALF = { w: 478, h: 176 }

export function clampView(v: ViewState): ViewState {
  const cl = (n: number, [a, b]: readonly [number, number]) => Math.min(b, Math.max(a, n))
  return {
    x: cl(v.x, [0, 100]),
    z: cl(v.z, [0, 100]),
    zoom: cl(v.zoom, LIMITS.zoom),
    turn: cl(v.turn, LIMITS.turn),
    tilt: cl(v.tilt, LIMITS.tilt),
  }
}

/** Vertical field of view (degrees) that frames the drawing for a given aspect ratio. */
export function fovFor(aspect: number): number {
  const half = Math.max(FRAME_HALF.h, FRAME_HALF.w / aspect)
  return (2 * Math.atan(half / (cam.f * OPEN_DISTANCE)) * 180) / Math.PI
}

/** Field of view and view shift that frame a part of the drawing (source units) for an aspect ratio.
 *  shiftX and shiftY are fractions of the viewport height. */
export function fitFrame(
  aspect: number,
  frame: { x0: number; y0: number; x1: number; y1: number },
) {
  const half = Math.max((frame.y1 - frame.y0) / 2, (frame.x1 - frame.x0) / 2 / aspect)
  const [px, py] = cam.pp
  return {
    fov: (2 * Math.atan(half / cam.f) * 180) / Math.PI,
    shiftX: ((frame.x0 + frame.x1) / 2 - px) / (2 * half),
    shiftY: ((frame.y0 + frame.y1) / 2 - py) / (2 * half),
  }
}

/** Place a camera for a view state. */
export function applyView(camera: THREE.PerspectiveCamera, v: ViewState): void {
  const target = boardToWorld(v.x, v.z)
  const az = az0 + (v.turn * Math.PI) / 180
  const el = el0 + (v.tilt * Math.PI) / 180
  const d = dist0 * v.zoom
  camera.position.set(
    target.x + d * Math.sin(az) * Math.cos(el),
    d * Math.sin(el),
    target.z + d * Math.cos(az) * Math.cos(el),
  )
  camera.up.set(0, 1, 0)
  camera.lookAt(target)
  camera.updateMatrixWorld()
}

/** World position of the default camera; cut-outs face this point. */
export const DEFAULT_CAMERA_POSITION = (() => {
  const c = new THREE.PerspectiveCamera()
  applyView(c, DEFAULT_VIEW)
  return c.position.clone()
})()

export function lerpView(a: ViewState, b: ViewState, k: number): ViewState {
  const l = (p: number, q: number) => p + (q - p) * k
  // zoom interpolates in log space so moving in and out feels even
  return {
    x: l(a.x, b.x),
    z: l(a.z, b.z),
    zoom: Math.exp(l(Math.log(a.zoom), Math.log(b.zoom))),
    turn: l(a.turn, b.turn),
    tilt: l(a.tilt, b.tilt),
  }
}
