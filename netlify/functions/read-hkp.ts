import type { Handler } from '@netlify/functions'
import { MAX_FILE_BYTES, parseHkp, profileText } from '../lib/hkp/parser'

const headers = {
  'Content-Type': 'application/json; charset=utf-8',
  'Cache-Control': 'no-store',
}
export const handler: Handler = async (event) => {
  if (event.httpMethod !== 'POST')
    return {
      statusCode: 405,
      headers: { ...headers, Allow: 'POST' },
      body: JSON.stringify({ error: 'Use POST to read a hotkey file.' }),
    }
  if ((event.body?.length ?? 0) > MAX_FILE_BYTES * 1.4 + 1024)
    return {
      statusCode: 413,
      headers,
      body: JSON.stringify({
        error: 'The file is too large. Maximum size: 256 KB.',
      }),
    }
  try {
    const body = JSON.parse(
      event.isBase64Encoded
        ? Buffer.from(event.body ?? '', 'base64').toString('utf8')
        : (event.body ?? ''),
    )
    if (
      typeof body.filename !== 'string' ||
      body.filename.length > 255 ||
      !/\.hkp$/i.test(body.filename) ||
      /[\x00-\x1f\x7f\\/]/.test(body.filename)
    )
      throw new Error('Choose a file with a .hkp extension.')
    if (
      typeof body.data !== 'string' ||
      !body.data.length ||
      body.data.length % 4 !== 0 ||
      !/^[A-Za-z0-9+/]*={0,2}$/.test(body.data)
    )
      throw new Error('The upload does not contain valid base64 file data.')
    const profile = parseHkp(Buffer.from(body.data, 'base64'), body.filename)
    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({ profile, text: profileText(profile) }),
    }
  } catch (error) {
    return {
      statusCode: 400,
      headers,
      body: JSON.stringify({
        error:
          error instanceof SyntaxError
            ? 'Invalid upload request.'
            : error instanceof Error
              ? error.message
              : 'Unable to read this hotkey file.',
      }),
    }
  }
}
