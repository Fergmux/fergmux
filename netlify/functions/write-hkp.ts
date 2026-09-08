import type { Handler, HandlerResponse } from '@netlify/functions'
import { editHkp } from '../lib/hkp/parser'
import { decodeUpload } from '../lib/hkp/upload'

const headers = {
  'Content-Type': 'application/json; charset=utf-8',
  'Cache-Control': 'no-store',
}

export const handler: Handler = async (event): Promise<HandlerResponse> => {
  if (event.httpMethod !== 'POST')
    return {
      statusCode: 405,
      headers: { ...headers, Allow: 'POST' },
      body: JSON.stringify({
        error: 'Use POST to download an edited hotkey file.',
      }),
    }
  if ((event.body?.length ?? 0) > 2 * 1024 * 1024)
    return {
      statusCode: 413,
      headers,
      body: JSON.stringify({ error: 'The edit request is too large.' }),
    }
  try {
    const body = JSON.parse(
      event.isBase64Encoded
        ? Buffer.from(event.body ?? '', 'base64').toString('utf8')
        : (event.body ?? '')
    )
    const upload = decodeUpload(body)
    const output = editHkp(upload.data, upload.filename, body.edits)
    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'application/octet-stream',
        'Cache-Control': 'no-store',
        'Content-Disposition': `attachment; filename*=UTF-8''${encodeURIComponent(upload.filename)}`,
      },
      isBase64Encoded: true,
      body: output.toString('base64'),
    }
  } catch (error) {
    return {
      statusCode: 400,
      headers,
      body: JSON.stringify({
        error:
          error instanceof SyntaxError
            ? 'Invalid edit request.'
            : error instanceof Error
              ? error.message
              : 'Unable to write this hotkey file.',
      }),
    }
  }
}
