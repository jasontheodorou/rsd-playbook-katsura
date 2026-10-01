import type { Voice } from '../foundations/[chapter]/components/Voices'

/** The two voices: Jason's two sketches (1 October 2026) and What we care about's two quotes. */
export const VOICES: Voice[] = [
  {
    src: '/illustrations/quotes/person-1.svg',
    ratio: 430.8 / 396.1,
    quote:
      'I have a phone but I don’t always have credit and I’m only confident using it for a few things.',
    mark: 'only confident using it for a few things',
  },
  {
    src: '/illustrations/quotes/person-2.svg',
    ratio: 466.4 / 495.2,
    quote: 'I speak a little English but I struggle with reading and writing, especially legal words.',
    mark: 'especially legal words',
  },
]
