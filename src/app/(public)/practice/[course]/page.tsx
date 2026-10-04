import { findCourse } from '../content'
import { CardPage } from '../CardPage'

type Props = { params: Promise<{ course: string }> }

export async function generateMetadata({ params }: Props) {
  const course = findCourse((await params).course)
  return { title: course ? `${course.title}. Shape your practice` : 'Not found' }
}

/** A course's own address opens its first card. The landing page links straight to the card to continue from. */
export default async function CoursePage({ params }: Props) {
  return <CardPage slug={(await params).course} n={1} />
}
