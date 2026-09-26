import '../../accordions/accordions.css'
import { BentoIconsVersions } from '../BentoIconsVersions'
import '../grid.css'
import '../bento.css'

export const metadata = { title: 'Bento with icons. The RSD Playbook' }

/** Three icon-led versions of the bento discovery grid, in the chapter frame. */
export default function BentoPage() {
  return <BentoIconsVersions />
}
