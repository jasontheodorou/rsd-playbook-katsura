import { findChapter } from '../chapters'
import { ChapterView } from './ChapterView'

export const dynamic = 'force-dynamic'

type Props = { params: Promise<{ chapter: string }> }

export async function generateMetadata({ params }: Props) {
  const chapter = findChapter((await params).chapter)
  return { title: chapter ? `${chapter.title}. The RSD Playbook` : 'Not found' }
}

/** A chapter, rendered in the frame over the grid that the layout keeps beneath it. */
export default async function ChapterPage({ params }: Props) {
  const { chapter } = await params
  return <ChapterView slug={chapter} />
}
