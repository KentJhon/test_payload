import { NextResponse } from 'next/server'

export async function GET() {
  const token = process.env.BLOB_READ_WRITE_TOKEN
  return NextResponse.json({
    blobTokenExists: !!token,
    blobTokenLength: token?.length ?? 0,
    blobTokenPrefix: token?.substring(0, 10) ?? 'MISSING',
    nodeEnv: process.env.NODE_ENV,
  })
}
