import type { DemoAsset } from '../content'
import { BeforeAfter, type BeforeProps } from './BeforeAfter'
import { Figure, Resource, Tip } from './Boxes'
import { ChooseSee, type ChooseProps } from './ChooseSee'
import { FlipCards, type FlipProps } from './FlipCards'
import { MapExplorer, type MapProps } from './MapExplorer'
import { Match, type MatchProps } from './Match'
import { QuickCheck, type CheckProps } from './QuickCheck'
import { Slider, type SliderProps } from './Slider'
import { SpotProblem, type SpotProps } from './SpotProblem'
import { StepThrough, type StepProps } from './StepThrough'

/** A quoted line in an asset's acceptance, such as the Match summary line. */
const quotedIn = (lines: string[] | undefined, lead: RegExp) =>
  lines?.find((l) => lead.test(l))?.match(/'([^']+)'\s*$/)?.[1]

/** One asset, by its component ID, given the plan's data as props. */
export function Asset({ asset }: { asset: DemoAsset }) {
  const p = asset.props as never
  switch (asset.component) {
    case 'tip':
      return <Tip {...(p as { text: string })} />
    case 'resource':
      return (
        <Resource {...(p as { title: string; url: string; summary: string; source: string })} />
      )
    case 'image':
      return (
        <Figure
          {...(p as { kind: 'photo' | 'diagram'; brief: string; alt: string; caption?: string })}
        />
      )
    case 'slider':
      return <Slider {...(p as SliderProps)} />
    case 'step':
      return <StepThrough {...(p as StepProps)} />
    case 'flip':
      return <FlipCards {...(p as FlipProps)} />
    case 'match':
      return (
        <Match
          {...(p as MatchProps)}
          summary={
            (asset.props as { summary?: string }).summary ??
            quotedIn(asset.acceptance, /summary line/i)
          }
        />
      )
    case 'spot':
      return <SpotProblem {...(p as SpotProps)} />
    case 'before':
      return <BeforeAfter {...(p as BeforeProps)} />
    case 'map':
      return <MapExplorer {...(p as MapProps)} />
    case 'check':
      return <QuickCheck {...(p as CheckProps)} />
    case 'choose':
      return <ChooseSee {...(p as ChooseProps)} />
    default:
      return null
  }
}
