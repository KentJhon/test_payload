import { NextResponse } from 'next/server'
import { getPayload } from 'payload'
import configPromise from '@payload-config'

export async function GET() {
  const token = process.env.BLOB_READ_WRITE_TOKEN
  const storeId = token?.match(/^vercel_blob_rw_([a-z\d]+)_[a-z\d]+$/i)?.[1]

  let mediaConfig: any = null
  try {
    const payload = await getPayload({ config: configPromise })
    const mediaCollection = payload.config.collections.find((c: any) => c.slug === 'media')
    mediaConfig = {
      slug: mediaCollection?.slug,
      disableLocalStorage: (mediaCollection?.upload as any)?.disableLocalStorage ?? false,
      hasHandlers: !!(mediaCollection?.upload as any)?.handlers,
    }
  } catch (e: any) {
    mediaConfig = { error: e.message }
  }

  return NextResponse.json({
    blobTokenExists: !!token,
    blobTokenLength: token?.length ?? 0,
    regexMatch: !!storeId,
    storeId: storeId ?? 'NO_MATCH',
    mediaConfig,
    nodeEnv: process.env.NODE_ENV,
  })
}
