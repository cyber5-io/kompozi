import { withPayload } from '@payloadcms/next/withPayload'

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  transpilePackages: [
    '@payloadcms/ui',
    '@payloadcms/next',
    '@payloadcms/richtext-lexical',
  ],
  allowedDevOrigins: ['kompozi.local'],
}

export default withPayload(nextConfig)
