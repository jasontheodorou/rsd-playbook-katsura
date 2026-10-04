'use client'

import {
  BackgroundImage,
  Badge,
  Card,
  Image,
  Overlay,
  Paper,
  SimpleGrid,
  Tabs,
} from '@mantine/core'
import '@mantine/core/styles/UnstyledButton.css'
import '@mantine/core/styles/BackgroundImage.css'
import '@mantine/core/styles/Badge.css'
import '@mantine/core/styles/Card.css'
import '@mantine/core/styles/Image.css'
import '@mantine/core/styles/Overlay.css'
import '@mantine/core/styles/Paper.css'
import '@mantine/core/styles/SimpleGrid.css'
import '@mantine/core/styles/Tabs.css'

import type { PhotoAsset } from '../content/photos'

/**
 * The six photo formats Jason chose on /syp-images (3 October 2026), built from Mantine in the
 * cards' Transform palette and elevation: tonal frame, pair, card with image, tabbed photos,
 * background image and badged image. Each takes its data from content/photos.ts.
 */
export function PhotoBlock({ asset }: { asset: PhotoAsset }) {
  const cap = (t?: string) => t && <p className="pc-photo__cap">{t}</p>
  switch (asset.format) {
    case 'frame':
      return (
        <Paper className="pc-photo pc-photo--frame" radius="lg" p="md">
          <Image src={asset.photo.src} alt={asset.photo.alt} radius="md" />
          {cap(asset.caption)}
        </Paper>
      )
    case 'pair':
      return (
        <figure className="pc-photo">
          <SimpleGrid cols={{ base: 1, sm: 2 }} spacing="sm">
            {asset.photos.map((p) => (
              <Image key={p.src} src={p.src} alt={p.alt} radius="md" h={220} />
            ))}
          </SimpleGrid>
          {cap(asset.caption)}
        </figure>
      )
    case 'card':
      return (
        <Card className="pc-photo pc-photo--card" radius="md" padding="lg">
          <Card.Section>
            <Image src={asset.photo.src} alt={asset.photo.alt} h={260} />
          </Card.Section>
          <p className="pc-photo__title">{asset.title}</p>
          {asset.text && <p className="pc-photo__text">{asset.text}</p>}
        </Card>
      )
    case 'tabs':
      return (
        <figure className="pc-photo">
          <Tabs
            defaultValue={asset.tabs[0].label}
            variant="pills"
            radius="xl"
            color="var(--pc-deep)"
            className="pc-photo__tabs"
          >
            <Tabs.List>
              {asset.tabs.map((t) => (
                <Tabs.Tab key={t.label} value={t.label}>
                  {t.label}
                </Tabs.Tab>
              ))}
            </Tabs.List>
            {asset.tabs.map((t) => (
              <Tabs.Panel key={t.label} value={t.label}>
                <Image src={t.photo.src} alt={t.photo.alt} radius="md" h={320} />
              </Tabs.Panel>
            ))}
          </Tabs>
        </figure>
      )
    case 'background':
      return (
        <BackgroundImage
          className="pc-photo pc-photo--bg"
          src={asset.photo.src}
          radius="md"
          role="img"
          aria-label={asset.photo.alt}
        >
          <Overlay
            gradient="linear-gradient(180deg, rgba(33, 61, 89, 0) 30%, rgba(33, 61, 89, 0.85) 100%)"
            radius="md"
            zIndex={1}
          />
          <div className="pc-photo__over">
            <p className="pc-photo__over-title">{asset.title}</p>
            {asset.text && <p className="pc-photo__over-text">{asset.text}</p>}
          </div>
        </BackgroundImage>
      )
    case 'badged':
      return (
        <figure className="pc-photo pc-photo--badged">
          <Image src={asset.photo.src} alt={asset.photo.alt} radius="md" />
          <Badge className="pc-photo__badge" color="var(--pc-deep)" radius="sm" size="lg">
            {asset.badge}
          </Badge>
          {cap(asset.caption)}
        </figure>
      )
  }
}
