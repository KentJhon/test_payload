import { NextResponse } from 'next/server'

export async function GET() {
  const token = process.env.BLOB_READ_WRITE_TOKEN
  const storeId = token?.match(/^vercel_blob_rw_([a-z\d]+)_[a-z\d]+$/i)?.[1]
  return NextResponse.json({
    blobTokenExists: !!token,
    blobTokenLength: token?.length ?? 0,
    blobTokenPrefix: token?.substring(0, 20) ?? 'MISSING',
    regexMatch: !!storeId,
    storeId: storeId ?? 'NO_MATCH',
    nodeEnv: process.env.NODE_ENV,
  })
}
