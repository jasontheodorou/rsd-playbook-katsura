import { notFound } from 'next/navigation'

import '../modular/two-zones.css'
import '../modular/two-zones-mantine.css'
import { CardBody } from './components/CardBody'
import { findCourse } from './content'
import { CourseShell, type ShellCourse } from './CourseShell'
import './practice.css'

/** A course page open at one card: the shell (client) around the card (rendered here, on the server, so it reads without JavaScript). */
export function CardPage({ slug, n }: { slug: string; n: number }) {
  const course = findCourse(slug)
  const card = course?.cards.find((c) => c.n === n)
  if (!course || !card) notFound()
  const shell: ShellCourse = {
    slug: course.slug,
    title: course.title,
    lessons: course.lessons.map((l) => ({
      name: l.name,
      cards: l.cards.map((c) => ({ n: c.n, title: c.title })),
    })),
    minutes: course.minutes,
  }
  return (
    <div
      className="sp-course"
      style={{
        ['--pc-accent' as string]: course.theme.accent,
        ['--pc-deep' as string]: course.theme.deep,
        ['--pc-tint' as string]: course.theme.tint,
        ['--w-base' as string]: course.theme.wash.base,
        ['--w-a' as string]: course.theme.wash.a,
        ['--w-b' as string]: course.theme.wash.b,
        ['--w-at-a' as string]: course.theme.wash.at.split(', ')[0],
        ['--w-at-b' as string]: course.theme.wash.at.split(', ')[1],
      }}
    >
      <CourseShell course={shell} n={n} title={card.title}>
        <CardBody card={card} course={course.n} />
      </CourseShell>
    </div>
  )
}
