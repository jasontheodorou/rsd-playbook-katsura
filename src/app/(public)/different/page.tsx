import '../accordions/accordions.css'
import * as I from './Ideas'
import './different.css'

export const metadata = { title: 'Different. The RSD Playbook' }

type Idea = { id: string; name: string; page: string; rule: string; demo: React.ReactNode }

const GROUPS: { name: string; intro: string; ideas: Idea[] }[] = [
  {
    name: 'Images',
    intro: 'New ways to hold a photograph, none used on pages 1 to 3.',
    ideas: [
      {
        id: 'polaroid',
        name: 'Polaroid scatter',
        page: 'Heart',
        rule: 'Prints pinned at angles, with a written caption. Pointing at one straightens and lifts it. Suits the stories on What we care about.',
        demo: <I.PolaroidScatter />,
      },
      {
        id: 'compare',
        name: 'Sketch to real',
        page: 'Hands',
        rule: 'Drag a divider across one photo: a pencil version on one side, the real thing on the other. Says “from prototype to pilot” without words.',
        demo: <I.SketchToReal />,
      },
      {
        id: 'zoom',
        name: 'Zoom in, zoom out',
        page: 'Heart',
        rule: 'As you scroll, the photo moves from a close human detail out to the whole room, acting out Ian’s “zoom in” and “zoom out”.',
        demo: <I.ZoomInOut />,
      },
      {
        id: 'strip',
        name: 'Filmstrip',
        page: 'Hands',
        rule: 'A sideways strip of numbered photos that snaps, like contact prints. Shows many moments of delivery in little height.',
        demo: <I.Filmstrip />,
      },
      {
        id: 'duo',
        name: 'Duotone in the part’s colour',
        page: 'All three',
        rule: 'Photos recoloured in the chapter’s own ink (orange, red, plum), so each page’s images feel like one set.',
        demo: <I.Duotone />,
      },
      {
        id: 'mask',
        name: 'Photo in the scribble',
        page: 'All three',
        rule: 'A photo seen through the shape of the chapter’s scribble. Ties the photography straight to the sketch.',
        demo: <I.ScribbleMask />,
      },
    ],
  },
  {
    name: 'Text',
    intro: 'Ways to give long passages a shape of their own.',
    ideas: [
      {
        id: 'nums',
        name: 'Big numbers',
        page: 'All three',
        rule: 'The pages’ counts set huge: five layers, three ways, four steps. Each with one line, rising in on first view.',
        demo: <I.BigNumbers />,
      },
      {
        id: 'margin',
        name: 'Margin note',
        page: 'Head',
        rule: 'A key line written into the empty columns beside the text, with a hand-drawn arrow, like a note on a printout.',
        demo: <I.MarginNote />,
      },
      {
        id: 'circle',
        name: 'Hand-drawn circle',
        page: 'Head',
        rule: 'One key word gets circled in ink as it scrolls into view, as a designer would mark up a page.',
        demo: <I.DrawnCircle />,
      },
      {
        id: 'reveal',
        name: 'Words that light up',
        page: 'Hands',
        rule: 'The statement brightens word by word as you scroll, so the page’s opening line is read, not skimmed.',
        demo: <I.WordReveal />,
      },
      {
        id: 'qcards',
        name: 'Question cards',
        page: 'Hands',
        rule: 'Desirability, feasibility and viability as three cards. Each shows its word as a question and turns over to its test.',
        demo: <I.QuestionCards />,
      },
      {
        id: 'term',
        name: 'Inline definition',
        page: 'All three',
        rule: 'A term with a dotted underline opens its meaning inside the sentence, as GOV.UK does with details. For jargon such as “failure demand”.',
        demo: <I.InlineDefinition />,
      },
    ],
  },
  {
    name: 'Interaction',
    intro: 'Things the reader does, each acting out an idea from the page.',
    ideas: [
      {
        id: 'zswitch',
        name: 'Zoom switch',
        page: 'Heart',
        rule: 'One toggle moves the same scene between the human detail and the big picture. The reader does the zooming.',
        demo: <I.ZoomSwitch />,
      },
      {
        id: 'persona',
        name: 'Persona card',
        page: 'Heart',
        rule: 'A person’s own words on the front of a card. Turn it over to see what they mean for design. Gives the user quotes a context.',
        demo: <I.PersonaCard />,
      },
      {
        id: 'order',
        name: 'Put them in order',
        page: 'Hands',
        rule: 'Tap the participation steps in the order they happen. A small check that the model has landed.',
        demo: <I.PutInOrder />,
      },
      {
        id: 'conseq',
        name: 'Consequence map',
        page: 'Heart',
        rule: 'Choose a decision and its knock-on effects branch out, the good and the unintended. Acts out “consequence mapping”.',
        demo: <I.ConsequenceMap />,
      },
      {
        id: 'sys',
        name: 'Systems map',
        page: 'Head',
        rule: 'People, policies, place and service joined by lines. Point at one to light its connections. Acts out systems mapping.',
        demo: <I.SystemsMap />,
      },
      {
        id: 'turn',
        name: 'Your turn',
        page: 'Head',
        rule: 'A short reflection prompt with a private note that stays in the browser. Turns reading into practice.',
        demo: <I.YourTurn />,
      },
      {
        id: 'poll',
        name: 'Quick poll',
        page: 'Head',
        rule: 'One tap on a question, then how your answer compares. The figures here are placeholders; real ones would need a store.',
        demo: <I.QuickPoll />,
      },
      {
        id: 'board',
        name: 'Build the wall',
        page: 'Heart',
        rule: 'Drag the uses of stories around a board like sticky notes. Playful, tactile and in the sketch’s language.',
        demo: <I.BuildTheWall />,
      },
    ],
  },
]

/** Twenty ideas to make chapters 04 to 06 feel different from the rest of the manual. */
// Each idea's number, counted across the groups.
const NUMBER = new Map(GROUPS.flatMap((g) => g.ideas).map((o, i) => [o.id, i + 1]))

export default function DifferentPage() {
  return (
    <div className="accp">
      <aside className="accp-rail" aria-hidden="true">
        <span className="accp-rail__number">04</span>
        <span className="accp-rail__track" />
      </aside>
      <div className="accp-main">
        <header className="accp-intro">
          <h1 className="accp-intro__title">Different</h1>
          <p className="accp-intro__lede">
            Twenty ideas to make How we think, What we care about and How we deliver feel unlike the
            rest of the manual. Each is a live sketch with real content, and names the page it
            suits.
          </p>
        </header>
        {GROUPS.map((g) => (
          <div key={g.name} className="d-group">
            <h2 className="d-group__name">{g.name}</h2>
            <p className="d-group__intro">{g.intro}</p>
            {g.ideas.map((o) => {
              const n = NUMBER.get(o.id) ?? 0
              return (
                <section key={o.id} className="accp-design" aria-labelledby={`d-${o.id}`}>
                  <div className="accp-design__head">
                    <span className="accp-design__id">{String(n).padStart(2, '0')}</span>
                    <h3 id={`d-${o.id}`} className="accp-design__name">
                      {o.name} <span className="d-for">For {o.page}</span>
                    </h3>
                    <p className="accp-design__rule">{o.rule}</p>
                  </div>
                  <div className="accp-design__demo d-demo">{o.demo}</div>
                </section>
              )
            })}
          </div>
        ))}
      </div>
    </div>
  )
}
