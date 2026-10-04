'use client'

import {
  Accordion,
  AspectRatio,
  Avatar,
  BackgroundImage,
  Badge,
  Blockquote,
  Card,
  HoverCard,
  Image,
  Indicator,
  MantineProvider,
  Modal,
  Overlay,
  Paper,
  Popover,
  ScrollArea,
  SegmentedControl,
  SimpleGrid,
  Slider,
  Spoiler,
  Tabs,
  UnstyledButton,
  createTheme,
} from '@mantine/core'
import '@mantine/core/styles/default-css-variables.css'
import '@mantine/core/styles/UnstyledButton.css'
import '@mantine/core/styles/Text.css'
import '@mantine/core/styles/Anchor.css'
import '@mantine/core/styles/Accordion.css'
import '@mantine/core/styles/AspectRatio.css'
import '@mantine/core/styles/Avatar.css'
import '@mantine/core/styles/BackgroundImage.css'
import '@mantine/core/styles/Badge.css'
import '@mantine/core/styles/Blockquote.css'
import '@mantine/core/styles/Card.css'
import '@mantine/core/styles/CloseButton.css'
import '@mantine/core/styles/Image.css'
import '@mantine/core/styles/Indicator.css'
import '@mantine/core/styles/Modal.css'
import '@mantine/core/styles/ModalBase.css'
import '@mantine/core/styles/Overlay.css'
import '@mantine/core/styles/Paper.css'
import '@mantine/core/styles/Popover.css'
import '@mantine/core/styles/ScrollArea.css'
import '@mantine/core/styles/SegmentedControl.css'
import '@mantine/core/styles/SimpleGrid.css'
import '@mantine/core/styles/Slider.css'
import '@mantine/core/styles/Spoiler.css'
import '@mantine/core/styles/Tabs.css'
import { ChatCircleText, MagnifyingGlassPlus } from '@phosphor-icons/react'
import { useState, type ReactNode } from 'react'

/*
 * Twenty image formats for Shape your practice cards, second try (3 October 2026). Jason found the
 * first twelve "aren't the best" and asked for images that slot seamlessly into the card we have,
 * using Mantine. Each format is a Mantine component (or a few together) shown inside a copy of
 * the real card: the course page's white zone, its title, lead, words and spacing (practice.css),
 * in the Transform palette. Captions are sample wording, for judging the formats only.
 */

const NAVY = '#213D59'
const theme = createTheme({
  fontFamily: 'inherit',
  headings: { fontFamily: 'inherit' },
  black: '#333333',
})

const P = {
  talk: {
    src: '/photos/three-way-conversation.png',
    alt: 'Three colleagues in conversation at a table, one explaining with her hands.',
  },
  sofa: {
    src: '/photos/journey-map-group.jpg',
    alt: 'A man on a red sofa holds a worksheet while colleagues gather round, smiling.',
  },
  task: {
    src: '/photos/problem-framing.jpg',
    alt: 'Three people at a table, one pointing at a worksheet marked Task 2.',
  },
  wall: {
    src: '/photos/insight-wall-sticky.png',
    alt: 'A man writes on a sticky note on a wall covered in notes.',
  },
  quotes: { src: '/photos/wall-of-quotes.jpg', alt: 'A group reads cards pinned to a wall.' },
  flip: {
    src: '/photos/head-flipchart.jpg',
    alt: 'A woman writes on a flipchart while two colleagues watch.',
  },
  lego: {
    src: '/photos/lego-prototyping.jpg',
    alt: 'Four people build models from Lego bricks on a low table.',
  },
  sheet: {
    src: '/photos/worksheet-writing.png',
    alt: 'Close-up of hands holding a pen over a printed worksheet.',
  },
  meet: {
    src: '/photos/team-meeting.png',
    alt: 'Five colleagues talk around a white meeting table with laptops.',
  },
  window: {
    src: '/photos/window-conversation.jpg',
    alt: 'Two colleagues talk by a window in a bright office.',
  },
  eunice: {
    src: '/photos/eunice-tracey.jpg',
    alt: 'Two colleagues smile as they unpack a box at a desk.',
  },
}

const Caption = ({ children }: { children: ReactNode }) => <p className="si2-cap">{children}</p>

/* ---------------- the twenty ---------------- */

function F1() {
  return (
    <figure className="pc-figure si2-fig">
      <Image src={P.talk.src} alt={P.talk.alt} radius="md" />
      <Caption>
        Listening first: start every session by hearing how people describe the problem.
      </Caption>
    </figure>
  )
}

function F2() {
  return (
    <figure className="pc-figure si2-fig">
      <AspectRatio ratio={21 / 9}>
        <Image src={P.lego.src} alt={P.lego.alt} radius="md" />
      </AspectRatio>
      <Caption>
        <b>Figure 1.</b> Prototyping with whatever is to hand makes an idea real enough to argue
        about.
      </Caption>
    </figure>
  )
}

function F3() {
  return (
    <Card className="pc-figure" shadow="sm" radius="md" padding="lg" withBorder>
      <Card.Section>
        <Image src={P.flip.src} alt={P.flip.alt} h={240} />
      </Card.Section>
      <p className="si2-card__title">Make the thinking visible</p>
      <p className="si2-card__text">
        Writing as you go lets the whole room see, challenge and build on an idea.
      </p>
    </Card>
  )
}

function F4() {
  return (
    <Card className="pc-figure si2-hcard" shadow="sm" radius="md" padding={0} withBorder>
      <Image src={P.sofa.src} alt={P.sofa.alt} w={200} h={200} fit="cover" />
      <div className="si2-hcard__body">
        <p className="si2-card__title">Bring people into the room</p>
        <p className="si2-card__text">
          The people who use a service see problems the team cannot. Sit with them, not across from
          them.
        </p>
      </div>
    </Card>
  )
}

function F5() {
  return (
    <BackgroundImage
      className="pc-figure si2-bg"
      src={P.window.src}
      radius="md"
      role="img"
      aria-label={P.window.alt}
    >
      <Overlay
        gradient="linear-gradient(180deg, rgba(33, 61, 89, 0) 30%, rgba(33, 61, 89, 0.85) 100%)"
        radius="md"
        zIndex={1}
      />
      <div className="si2-bg__text">
        <p className="si2-bg__title">Meet people where they are</p>
        <p className="si2-bg__sub">
          Research in someone&apos;s own space tells you what a meeting room never will.
        </p>
      </div>
    </BackgroundImage>
  )
}

function F6() {
  return (
    <figure className="pc-figure si2-fig si2-badged">
      <Image src={P.task.src} alt={P.task.alt} radius="md" />
      <Badge className="si2-badge" color={NAVY} radius="sm" size="lg">
        In practice
      </Badge>
      <Caption>A team frames the problem before anyone sketches a solution.</Caption>
    </figure>
  )
}

function F7() {
  return (
    <figure className="pc-figure si2-fig">
      <HoverCard width={300} shadow="md" position="top" withArrow openDelay={100}>
        <HoverCard.Target>
          <UnstyledButton className="si2-hover" aria-label="About this photo">
            <Image src={P.wall.src} alt={P.wall.alt} radius="md" />
            <span className="si2-hover__hint">
              <ChatCircleText size={16} weight="bold" /> About this photo
            </span>
          </UnstyledButton>
        </HoverCard.Target>
        <HoverCard.Dropdown>
          <p className="si2-pop">
            Each sticky note holds one observation, in the participant&apos;s own words, so nothing
            is lost in summary.
          </p>
        </HoverCard.Dropdown>
      </HoverCard>
    </figure>
  )
}

function F8() {
  return (
    <figure className="pc-figure si2-fig">
      <Image src={P.quotes.src} alt={P.quotes.alt} radius="md" />
      <Spoiler maxHeight={45} showLabel="Read more" hideLabel="Show less" className="si2-spoiler">
        <p className="si2-cap">
          The team pinned every quote from the week&apos;s interviews to one wall. Reading them
          together, rather than in separate notes, showed that three different services were asking
          people for the same documents. That became the first thing to fix, and the clearest
          evidence the team had for the client.
        </p>
      </Spoiler>
    </figure>
  )
}

function F9() {
  return (
    <figure className="pc-figure si2-fig">
      <SimpleGrid cols={2} spacing="sm">
        <Image src={P.wall.src} alt={P.wall.alt} radius="md" h={220} />
        <Image src={P.flip.src} alt={P.flip.alt} radius="md" h={220} />
      </SimpleGrid>
      <Caption>Capture everything first (left), then make sense of it together (right).</Caption>
    </figure>
  )
}

function F10() {
  const [open, setOpen] = useState<number | null>(null)
  const set = [P.task, P.sheet, P.lego]
  return (
    <figure className="pc-figure si2-fig">
      <SimpleGrid cols={3} spacing="sm">
        {set.map((p, k) => (
          <UnstyledButton
            key={p.src}
            className="si2-thumb"
            onClick={() => setOpen(k)}
            aria-label={`Enlarge: ${p.alt}`}
          >
            <Image src={p.src} alt="" radius="md" h={150} />
            <span className="si2-thumb__zoom" aria-hidden>
              <MagnifyingGlassPlus size={16} weight="bold" />
            </span>
          </UnstyledButton>
        ))}
      </SimpleGrid>
      <Caption>Select a photo to see it larger.</Caption>
      <Modal
        opened={open !== null}
        onClose={() => setOpen(null)}
        size="xl"
        radius="md"
        centered
        withCloseButton
        title={open !== null ? set[open].alt : ''}
      >
        {open !== null && <Image src={set[open].src} alt={set[open].alt} radius="sm" />}
      </Modal>
    </figure>
  )
}

function F11() {
  return (
    <figure className="pc-figure si2-fig">
      <Tabs defaultValue="before" color={NAVY} variant="pills" radius="xl" className="si2-tabs">
        <Tabs.List>
          <Tabs.Tab value="before">Before the session</Tabs.Tab>
          <Tabs.Tab value="during">During</Tabs.Tab>
          <Tabs.Tab value="after">After</Tabs.Tab>
        </Tabs.List>
        <Tabs.Panel value="before">
          <Image src={P.sheet.src} alt={P.sheet.alt} radius="md" h={300} />
          <Caption>Plan the questions, and leave room for what you did not expect.</Caption>
        </Tabs.Panel>
        <Tabs.Panel value="during">
          <Image src={P.talk.src} alt={P.talk.alt} radius="md" h={300} />
          <Caption>Listen more than you talk, and note people&apos;s exact words.</Caption>
        </Tabs.Panel>
        <Tabs.Panel value="after">
          <Image src={P.wall.src} alt={P.wall.alt} radius="md" h={300} />
          <Caption>Put every observation up where the team can see it.</Caption>
        </Tabs.Panel>
      </Tabs>
    </figure>
  )
}

function F12() {
  const [v, setV] = useState('workshop')
  const pick = v === 'workshop' ? P.lego : P.window
  return (
    <figure className="pc-figure si2-fig">
      <SegmentedControl
        value={v}
        onChange={setV}
        color={NAVY}
        radius="xl"
        className="si2-seg"
        data={[
          { label: 'In a workshop', value: 'workshop' },
          { label: 'In their own space', value: 'own' },
        ]}
      />
      <Image src={pick.src} alt={pick.alt} radius="md" h={300} />
      <Caption>
        {v === 'workshop'
          ? 'Workshops are good for making ideas together.'
          : 'People’s own spaces show you how a service fits their day.'}
      </Caption>
    </figure>
  )
}

function F13() {
  return (
    <Paper className="pc-figure si2-paper" radius="lg" p="md">
      <Image src={P.meet.src} alt={P.meet.alt} radius="md" />
      <Caption>A whole team reviews the evidence together before deciding what to change.</Caption>
    </Paper>
  )
}

function F14() {
  const people = [P.talk, P.sofa, P.eunice, P.window]
  return (
    <figure className="pc-figure si2-fig">
      <Image src={P.sofa.src} alt={P.sofa.alt} radius="md" h={280} />
      <div className="si2-people">
        <Avatar.Group spacing="sm">
          {people.map((p) => (
            <Avatar key={p.src} src={p.src} alt="" radius="xl" size="md" />
          ))}
          <Avatar radius="xl" size="md" color={NAVY}>
            +6
          </Avatar>
        </Avatar.Group>
        <p className="si2-cap">
          Who was involved: residents, frontline staff and the delivery team.
        </p>
      </div>
    </figure>
  )
}

const NOTES = [
  { x: 52, y: 80, text: 'The task is written down, so everyone answers the same question.' },
  { x: 30, y: 40, text: 'One person explains while pointing at the evidence, not at an opinion.' },
  { x: 86, y: 60, text: 'Others listen and question before adding their own ideas.' },
]
function F15() {
  return (
    <figure className="pc-figure si2-fig">
      <div className="si2-anno">
        <Image src={P.task.src} alt={P.task.alt} radius="md" />
        {NOTES.map((n, k) => (
          <Popover key={k} width={240} position="top" withArrow shadow="md">
            <Popover.Target>
              <UnstyledButton
                className="si2-anno__pin"
                style={{ left: `${n.x}%`, top: `${n.y}%` }}
                aria-label={`Note ${k + 1}`}
              >
                <Indicator processing color={NAVY} size={10} offset={2}>
                  <span className="si2-anno__num">{k + 1}</span>
                </Indicator>
              </UnstyledButton>
            </Popover.Target>
            <Popover.Dropdown>
              <p className="si2-pop">{n.text}</p>
            </Popover.Dropdown>
          </Popover>
        ))}
      </div>
      <Caption>Select a number to see what to notice.</Caption>
    </figure>
  )
}

function F16() {
  return (
    <figure className="pc-figure si2-fig si2-quote">
      <Blockquote
        color={NAVY}
        radius="md"
        iconSize={44}
        icon={<Avatar src={P.eunice.src} alt="" radius="xl" size={44} />}
        cite="– Participant, housing services research"
        mt="lg"
      >
        Nobody had ever asked me what the form was like to fill in. I had a lot to say.
      </Blockquote>
    </figure>
  )
}

function F17() {
  return (
    <Accordion
      className="pc-figure si2-acc"
      variant="separated"
      radius="md"
      chevronPosition="right"
    >
      <Accordion.Item value="practice">
        <Accordion.Control>See it in practice</Accordion.Control>
        <Accordion.Panel>
          <Image src={P.wall.src} alt={P.wall.alt} radius="md" />
          <Caption>A researcher sorts what they heard into themes on the wall.</Caption>
        </Accordion.Panel>
      </Accordion.Item>
    </Accordion>
  )
}

function F18() {
  const [v, setV] = useState(50)
  return (
    <figure className="pc-figure si2-fig">
      <div className="si2-compare" style={{ ['--v' as string]: `${v}%` }}>
        <Image src={P.meet.src} alt={P.meet.alt} radius="md" h={320} className="si2-compare__a" />
        <Image src={P.talk.src} alt={P.talk.alt} radius="md" h={320} className="si2-compare__b" />
        <span className="si2-compare__line" aria-hidden />
      </div>
      <Slider
        value={v}
        onChange={setV}
        color={NAVY}
        label={null}
        size="sm"
        className="si2-compare__slider"
        aria-label="Compare the two photos"
      />
      <Caption>
        Slide to compare a team talking about users (left) with a team talking to them (right).
      </Caption>
    </figure>
  )
}

function F19() {
  const strip = [
    { p: P.wall, cap: 'Capture what you hear' },
    { p: P.quotes, cap: 'Group it into themes' },
    { p: P.flip, cap: 'Name the insight' },
    { p: P.lego, cap: 'Test an idea quickly' },
    { p: P.task, cap: 'Decide what to change' },
  ]
  return (
    <figure className="pc-figure si2-fig">
      <ScrollArea type="hover" scrollbarSize={6} offsetScrollbars>
        <div className="si2-strip">
          {strip.map((s, k) => (
            <Card
              key={s.cap}
              shadow="xs"
              radius="md"
              padding="sm"
              withBorder
              className="si2-strip__item"
            >
              <Card.Section>
                <Image src={s.p.src} alt={s.p.alt} h={130} />
              </Card.Section>
              <p className="si2-strip__cap">
                <b>{k + 1}</b> {s.cap}
              </p>
            </Card>
          ))}
        </div>
      </ScrollArea>
    </figure>
  )
}

const PLACEHOLDER =
  "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='800' height='300'%3E%3Crect width='800' height='300' fill='%23efedeb'/%3E%3Ctext x='400' y='150' font-family='sans-serif' font-size='18' font-weight='700' fill='%23333' text-anchor='middle'%3EPhoto to commission%3C/text%3E%3Ctext x='400' y='178' font-family='sans-serif' font-size='15' fill='%235c5c5c' text-anchor='middle'%3EA researcher listening to a participant in their own home%3C/text%3E%3C/svg%3E"

function F20() {
  return (
    <figure className="pc-figure si2-fig">
      <Image
        src={PLACEHOLDER}
        fallbackSrc={PLACEHOLDER}
        alt="Photo to commission: a researcher listens to a participant at their kitchen table, notebook open."
        radius="md"
        h={300}
      />
      <Caption>
        Until a photo exists, a placeholder keeps the card&apos;s shape and says what is missing;
        Mantine&apos;s fallbackSrc shows it if a photo ever fails to load.
      </Caption>
    </figure>
  )
}

const FORMATS: { n: number; name: string; rule: string; demo: () => ReactNode }[] = [
  {
    n: 1,
    name: 'Image',
    rule: 'Mantine Image with rounded corners and a caption: the plain default.',
    demo: F1,
  },
  {
    n: 2,
    name: 'Figure with ratio',
    rule: 'AspectRatio keeps every photo the same wide shape; the caption is numbered for reference.',
    demo: F2,
  },
  {
    n: 3,
    name: 'Card with image',
    rule: 'Card with an image section on top and a short title and line below.',
    demo: F3,
  },
  {
    n: 4,
    name: 'Horizontal card',
    rule: 'Card with a square photo beside its point, read together.',
    demo: F4,
  },
  {
    n: 5,
    name: 'Background image',
    rule: 'BackgroundImage with a navy gradient Overlay and white words on the photo.',
    demo: F5,
  },
  {
    n: 6,
    name: 'Badged image',
    rule: 'A Badge on the photo\'s corner labels what it shows, such as "In practice".',
    demo: F6,
  },
  {
    n: 7,
    name: 'Hover card',
    rule: 'HoverCard: pointing at the photo opens a small card that explains it.',
    demo: F7,
  },
  {
    n: 8,
    name: 'Long caption',
    rule: 'Spoiler: a long caption folds to two lines with "Read more".',
    demo: F8,
  },
  {
    n: 9,
    name: 'Pair',
    rule: 'SimpleGrid of two photos for a contrast or a sequence, with one caption.',
    demo: F9,
  },
  {
    n: 10,
    name: 'Gallery',
    rule: 'SimpleGrid of three thumbnails; selecting one opens it large in a Modal.',
    demo: F10,
  },
  {
    n: 11,
    name: 'Tabbed photos',
    rule: 'Tabs (pill style) switch between photos of the stages of a method.',
    demo: F11,
  },
  {
    n: 12,
    name: 'Switch',
    rule: 'SegmentedControl swaps between two settings of the same activity.',
    demo: F12,
  },
  {
    n: 13,
    name: 'Tonal frame',
    rule: "Paper on the card's pale surface holds the photo and its caption.",
    demo: F13,
  },
  {
    n: 14,
    name: 'Who was involved',
    rule: 'The photo with an Avatar.Group beneath, for the people behind the work.',
    demo: F14,
  },
  {
    n: 15,
    name: 'Hotspots',
    rule: 'Numbered pins with a gentle Indicator pulse; each opens a Popover note.',
    demo: F15,
  },
  {
    n: 16,
    name: 'Quote with face',
    rule: "Blockquote with a round Avatar as its icon, for a participant's words.",
    demo: F16,
  },
  {
    n: 17,
    name: 'Tucked away',
    rule: 'Accordion (separated): "See it in practice" opens to the photo, so it never crowds the words.',
    demo: F17,
  },
  {
    n: 18,
    name: 'Compare',
    rule: 'A Slider drags the line between two photos to compare them.',
    demo: F18,
  },
  {
    n: 19,
    name: 'Strip',
    rule: 'ScrollArea of small image Cards, one per step, scrolling sideways.',
    demo: F19,
  },
  {
    n: 20,
    name: 'Placeholder',
    rule: "A placeholder in the photo's place says what is still to commission; Mantine's fallbackSrc shows it if a photo ever fails to load.",
    demo: F20,
  },
]

export function Formats() {
  return (
    <MantineProvider theme={theme}>
      <div className="si si2">
        <header className="si-head">
          <p className="eyebrow">Shape your practice</p>
          <h1 className="landing__title">
            Image formats for{' '}
            <span className="accent-underline accent-underline--thick">cards</span>
          </h1>
          <p className="landing__blurb">
            Twenty ways a photo could sit in a course card, built from Mantine components and shown
            inside a copy of the real card. Captions are sample wording.
          </p>
        </header>
        <ol className="si-list">
          {FORMATS.map((f) => (
            <li key={f.n} className="si-format" id={`f${f.n}`}>
              <div className="si-format__head">
                <span className="si-format__n">{String(f.n).padStart(2, '0')}</span>
                <div>
                  <h2 className="si-format__name">{f.name}</h2>
                  <p className="si-format__rule">{f.rule}</p>
                </div>
              </div>
              {/* A copy of the real card: the course page's white zone, in course 1's colours. */}
              <div
                className="cp sp-course si2-stage"
                style={{
                  ['--pc-accent' as string]: '#619CBA',
                  ['--pc-deep' as string]: '#213D59',
                  ['--pc-tint' as string]: '#e5ecec',
                }}
              >
                <article className="cp-card si2-cardzone">
                  <h2 className="cp-card__title">1. Insight Built on Lived Experience</h2>
                  <div className="tz-words cp-words pc-words">
                    <p className="pc-lead">
                      Great design begins with understanding human experiences and contexts.
                    </p>
                    {f.demo()}
                    <p>
                      Conduct research that explores the full range of human motivations,
                      capabilities, opportunities, behaviours, cultures and contexts.
                    </p>
                  </div>
                </article>
              </div>
            </li>
          ))}
        </ol>
      </div>
    </MantineProvider>
  )
}
