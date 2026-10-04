import '../modular/two-zones.css'
import '../modular/two-zones-mantine.css'
import '../practice/practice.css'
import { Formats } from './Formats'
import './syp-images.css'

export const metadata = { title: 'Image formats for Shape your practice cards' }

/** /syp-images: twenty image formats for Shape your practice cards, built from Mantine, shown inside the real card. */
export default function SypImagesPage() {
  return <Formats />
}
