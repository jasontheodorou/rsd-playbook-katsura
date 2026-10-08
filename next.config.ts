import { withPayload } from '@payloadcms/next/withPayload'
import type { NextConfig } from 'next'
import path from 'path'
import { fileURLToPath } from 'url'

const dirname = path.dirname(fileURLToPath(import.meta.url))

const nextConfig: NextConfig = {
  // Standalone is for the plain Node process in a container. Vercel's own build adapter packages
  // the app itself and fails when standalone is also set (missing next-server.js.nft.json), so
  // it is left off there. VERCEL is set by Vercel's build machines.
  output: process.env.VERCEL ? undefined : 'standalone',
  // Keep the development badge away from the chapter's side control.
  devIndicators: { position: 'bottom-right' },
  // Image derivatives are made at upload time; no host image service.
  images: { unoptimized: true },
  webpack: (webpackConfig) => {
    webpackConfig.resolve.extensionAlias = {
      '.cjs': ['.cts', '.cjs'],
      '.js': ['.ts', '.tsx', '.js', '.jsx'],
      '.mjs': ['.mts', '.mjs'],
    }
    return webpackConfig
  },
  turbopack: { root: path.resolve(dirname) },
}

export default withPayload(nextConfig, { devBundleServerPackages: false })
