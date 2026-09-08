import { MAX_FILE_BYTES } from './parser'

export function decodeUpload(body: unknown): {
  filename: string
  data: Buffer
} {
  if (!body || typeof body !== 'object')
    throw new Error('Invalid upload request.')
  const { filename, data } = body as Record<string, unknown>
  if (
    typeof filename !== 'string' ||
    filename.length > 255 ||
    !/\.hkp$/i.test(filename) ||
    /[\x00-\x1f\x7f\\/]/.test(filename)
  )
    throw new Error('Choose a file with a .hkp extension.')
  if (
    typeof data !== 'string' ||
    !data.length ||
    data.length > Math.ceil(MAX_FILE_BYTES / 3) * 4 ||
    data.length % 4 !== 0 ||
    !/^[A-Za-z0-9+/]*={0,2}$/.test(data)
  )
    throw new Error(
      'The upload does not contain valid base64 file data (maximum 256 KB).'
    )
  return { filename, data: Buffer.from(data, 'base64') }
}
