import { findCourse } from '../../content'
import { CardPage } from '../../CardPage'

type Props = { params: Promise<{ course: string; card: string }> }

export async function generateMetadata({ params }: Props) {
  const { course: slug, card } = await params
  const course = findCourse(slug)
  const c = course?.cards.find((x) => x.n === Number(card))
  return { title: c && course ? `${c.title}. ${course.title}` : 'Not found' }
}

/** One card of a course, at /practice/<course>/<n>. */
export default async function CardRoute({ params }: Props) {
  const { course, card } = await params
  return <CardPage slug={course} n={Number(card)} />
}
