import { withPayload } from '@payloadcms/next/withPayload'

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  transpilePackages: [
    '@payloadcms/ui',
    '@payloadcms/next',
    '@payloadcms/richtext-lexical',
  ],
}

export default withPayload(nextConfig)
