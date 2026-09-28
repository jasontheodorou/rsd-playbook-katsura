/**
 * The head, heart and hands sketch (public/illustrations/head-heart-hands.png), cut into its ten
 * pieces: three posters and seven sticky notes. Positions are percentages of the full sketch
 * (1320 by 600), so the pieces rebuild it exactly when laid out together. The note stuck to the
 * head poster's corner is part of the head poster.
 */
export type PieceId =
  | 'head'
  | 'heart'
  | 'hands'
  | 'note-1'
  | 'note-2'
  | 'note-3'
  | 'note-4'
  | 'note-5'
  | 'note-6'
  | 'note-7'

export type Piece = { id: PieceId; x: number; y: number; w: number }

export const PIECES: Piece[] = [
  { id: 'note-1', x: 0, y: 35.833, w: 10.985 },
  { id: 'note-2', x: 4.47, y: 69.667, w: 10.076 },
  { id: 'note-3', x: 16.591, y: 82.833, w: 9.47 },
  { id: 'note-4', x: 75.985, y: 81.333, w: 10.682 },
  { id: 'note-5', x: 88.106, y: 75.5, w: 10.227 },
  { id: 'note-6', x: 89.848, y: 7.667, w: 8.561 },
  { id: 'note-7', x: 90.53, y: 40.5, w: 9.47 },
  { id: 'head', x: 6.212, y: 5.5, w: 32.121 },
  { id: 'heart', x: 38.409, y: 0, w: 26.742 },
  { id: 'hands', x: 69.621, y: 14.5, w: 19.848 },
]

export type PosterId = 'head' | 'heart' | 'hands'

/** The posters, with the manual's one-line definitions (F2.31 to F2.33) and their notes nearby. */
export const POSTERS: { id: PosterId; name: string; line: string; notes: PieceId[] }[] = [
  {
    id: 'head',
    name: 'Head',
    line: 'Head is how we think and frame our work.',
    notes: ['note-1', 'note-2', 'note-3'],
  },
  { id: 'heart', name: 'Heart', line: 'Heart is all the things we care about most.', notes: [] },
  {
    id: 'hands',
    name: 'Hands',
    line: 'Hands is how we deliver and get the job done.',
    notes: ['note-4', 'note-5', 'note-6', 'note-7'],
  },
]

export const isPoster = (id: PieceId): id is PosterId =>
  id === 'head' || id === 'heart' || id === 'hands'
