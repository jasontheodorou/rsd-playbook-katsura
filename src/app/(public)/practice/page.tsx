import '../landing2/contents.css'
import '../landing2/options.css'
import { type LiveCourse } from '../landing2/CoursesRich'
import { COURSES } from './content'
import './practice-landing.css'
import { PracticeLanding } from './PracticeLanding'

export const metadata = { title: 'Shape your practice. The RSD Playbook' }

/** /practice: Shape your practice's landing page, mirroring Explore the foundations, with the built courses live. */
export default function PracticePage() {
  const live: LiveCourse[] = COURSES.map((c) => ({
    slug: c.slug,
    title: c.title,
    summary: c.summary,
    ns: c.cards.map((k) => k.n),
    minutes: Object.values(c.minutes).reduce((t, m) => t + m, 0),
  }))
  return <PracticeLanding live={live} />
}
