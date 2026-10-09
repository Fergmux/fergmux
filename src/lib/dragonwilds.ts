// Read-only extraction of Dragonwilds' Xbox WGS wrapper and SPUD world metadata.
// Files never leave the browser; no world/player fields are rewritten.
export const MAX_SAVE_BYTES = 128 * 1024 * 1024
const MAX_IMPORT_BYTES = 256 * 1024 * 1024
const utf8 = new TextDecoder('utf-8', { fatal: true })
const utf16 = new TextDecoder('utf-16le', { fatal: true })

class Reader {
  position = 0
  constructor(readonly bytes: Uint8Array) {}
  take(size: number) {
    if (
      !Number.isSafeInteger(size) ||
      size < 0 ||
      this.position + size > this.bytes.length
    )
      throw new Error('The save or metadata is truncated.')
    const value = this.bytes.subarray(this.position, this.position + size)
    this.position += size
    return value
  }
  uint32() {
    const b = this.take(4)
    return new DataView(b.buffer, b.byteOffset, 4).getUint32(0, true)
  }
  int32() {
    const b = this.take(4)
    return new DataView(b.buffer, b.byteOffset, 4).getInt32(0, true)
  }
  wide() {
    const length = this.uint32()
    if (length > 4096) throw new Error('Unsupported WGS metadata string.')
    return utf16.decode(this.take(length * 2))
  }
  fstring() {
    const length = this.int32()
    if (!length || Math.abs(length) > 4096)
      throw new Error('Unsupported world metadata string.')
    const b = this.take(Math.abs(length) * (length < 0 ? 2 : 1))
    if (b[b.length - 1] !== 0 || (length < 0 && b[b.length - 2] !== 0))
      throw new Error('Invalid world metadata string.')
    return (length < 0 ? utf16 : utf8).decode(
      b.subarray(0, b.length - (length < 0 ? 2 : 1))
    )
  }
}

function magic(b: Uint8Array) {
  return String.fromCharCode(...b.subarray(0, 4))
}
function guid(b: Uint8Array) {
  const order = [3, 2, 1, 0, 5, 4, 7, 6, 8, 9, 10, 11, 12, 13, 14, 15]
  return order
    .map((i) => b[i].toString(16).padStart(2, '0'))
    .join('')
    .toUpperCase()
}

export interface WorldSlot {
  name: string
  backup: boolean
  folder: string
  containerVersion: number
}
export function readWgsIndex(bytes: Uint8Array): WorldSlot[] {
  const r = new Reader(bytes)
  if (r.uint32() !== 14)
    throw new Error(
      'This WGS index version is not supported. Current/backup status cannot be confirmed.'
    )
  const count = r.uint32()
  if (count > 2048) throw new Error('Too many WGS containers.')
  r.take(4)
  r.wide()
  r.take(12)
  r.wide()
  r.take(8)
  const worlds: WorldSlot[] = []
  for (let i = 0; i < count; i++) {
    const name = r.wide()
    if (r.wide() !== name) throw new Error('Inconsistent WGS slot metadata.')
    r.wide()
    const containerVersion = r.take(1)[0]
    r.take(4)
    const folder = guid(r.take(16))
    r.take(24)
    const match = /^(.*)Qxav(Qbak)?$/.exec(name)
    if (match)
      worlds.push({
        name: match[1],
        backup: Boolean(match[2]),
        folder,
        containerVersion,
      })
  }
  if (r.position !== bytes.length)
    throw new Error(
      'Unexpected WGS index data. Current/backup status cannot be confirmed.'
    )
  return worlds
}

export function readContainer(bytes: Uint8Array): string[] {
  const r = new Reader(bytes)
  if (r.uint32() !== 4) throw new Error('Unsupported WGS container descriptor.')
  const count = r.uint32()
  if (count > 64 || bytes.length !== 8 + count * 160)
    throw new Error('Invalid WGS container descriptor.')
  const blobs: string[] = []
  for (let i = 0; i < count; i++) {
    const label = utf16.decode(r.take(128)).split('\0')[0]
    r.take(16)
    const local = guid(r.take(16))
    if (label === 'Data') blobs.push(local)
  }
  return blobs
}

function worldName(info: Uint8Array): string {
  // CINF holds FString property names, data offsets, then the unchanged values.
  for (let i = 0; i <= info.length - 8; i++) {
    if (magic(info.subarray(i)) !== 'CINF') continue
    const outer = new Reader(info.subarray(i + 4))
    const size = outer.uint32()
    const r = new Reader(outer.take(size))
    const count = r.uint32()
    if (count < 1 || count > 256)
      throw new Error('Unsupported world property metadata.')
    const names = Array.from({ length: count }, () => r.fstring())
    if (r.uint32() !== count) throw new Error('Invalid world property offsets.')
    const offsets = Array.from({ length: count }, () => r.uint32())
    const data = r.take(r.uint32())
    if (
      r.position !== r.bytes.length ||
      offsets.some((o, j) => o >= data.length || (j > 0 && o <= offsets[j - 1]))
    )
      throw new Error('Invalid world property data.')
    const field = names.indexOf('WorldName')
    if (field < 0)
      throw new Error('No world name was found. This may be a character save.')
    const value = new Reader(
      data.subarray(offsets[field], offsets[field + 1] ?? data.length)
    )
    const name = value.fstring()
    if (value.position !== value.bytes.length)
      throw new Error('Unsupported world name data.')
    if (
      !name ||
      /[<>:"/\\|?*\x00-\x1f]/.test(name) ||
      /[ .]$/.test(name) ||
      /^(CON|PRN|AUX|NUL|COM[1-9]|LPT[1-9])(?:\.|$)/i.test(name)
    )
      throw new Error(
        'The internal world name cannot be used safely as a Windows filename. It has not been renamed.'
      )
    return name
  }
  throw new Error('No supported world metadata was found.')
}

export function validateWorld(bytes: Uint8Array) {
  const r = new Reader(bytes)
  if (magic(r.take(4)) !== 'SAVE' || r.uint32() !== bytes.length - 8)
    throw new Error('This is not a complete Dragonwilds SAVE file.')
  let name = '',
    hasGlob = false
  while (r.position < bytes.length) {
    const tag = magic(r.take(4))
    const data = r.take(r.uint32())
    if (tag === 'INFO') {
      if (name) throw new Error('Duplicate world information.')
      name = worldName(data)
    }
    if (tag === 'GLOB') hasGlob = true
  }
  if (!name || !hasGlob)
    throw new Error('The file does not contain a supported Dragonwilds world.')
  return name
}

export async function extractWorld(input: Uint8Array) {
  if (input.length > MAX_SAVE_BYTES)
    throw new Error('The save exceeds the 128 MiB limit.')
  if (magic(input) === 'SAVE')
    return { name: validateWorld(input), bytes: input, format: 'Native .sav' }
  const r = new Reader(input)
  if (r.uint32() !== 12 || r.uint32() !== 65536)
    throw new Error(
      'Unsupported Xbox wrapper. Choose the extensionless world file, not a character or metadata file.'
    )
  const expected = r.uint32()
  if (expected < 16 || expected > MAX_SAVE_BYTES)
    throw new Error('The decompressed save size is invalid or exceeds 128 MiB.')
  if (typeof DecompressionStream === 'undefined')
    throw new Error(
      'This browser cannot decompress saves. Use an up-to-date Chrome, Edge, Firefox or Safari.'
    )
  const stream = new Blob([input.slice(12)])
    .stream()
    .pipeThrough(new DecompressionStream('deflate'))
  const reader = stream.getReader()
  const bytes = new Uint8Array(expected)
  let size = 0
  try {
    while (true) {
      const { value, done } = await reader.read()
      if (done) break
      if (size + value.length > expected) {
        await reader.cancel()
        throw new Error('The decompressed data exceeds the Xbox wrapper size.')
      }
      bytes.set(value, size)
      size += value.length
    }
  } catch (error) {
    if (error instanceof Error && error.message.startsWith('The decompressed'))
      throw error
    throw new Error(
      'Decompression or checksum verification failed. The save may be damaged or unsupported.'
    )
  } finally {
    reader.releaseLock()
  }
  if (size !== expected)
    throw new Error('The extracted size does not match the Xbox wrapper.')
  return { name: validateWorld(bytes), bytes, format: 'Xbox WGS' }
}

export interface ImportedWorld {
  name: string
  bytes: Uint8Array
  format: string
  source: string
  status: 'Current' | 'Backup' | 'Unconfirmed'
  modified: number
}
export async function importWorlds(files: File[]) {
  if (
    files.length > 2048 ||
    files.reduce((sum, f) => sum + f.size, 0) > MAX_IMPORT_BYTES
  )
    throw new Error(
      'Choose up to 2,048 files and 256 MiB in total. Select one WGS account folder if needed.'
    )
  const notices: string[] = [],
    worlds: ImportedWorld[] = []
  const slots: { scope: string; slot: WorldSlot }[] = []
  const descriptors: { parent: string; version: number; blobs: string[] }[] = []
  const path = (f: File) => (f.webkitRelativePath || f.name).replace(/\\/g, '/')
  const parent = (p: string) =>
    p.includes('/') ? p.slice(0, p.lastIndexOf('/')) : ''
  for (const file of files.filter((f) => f.name === 'containers.index')) {
    if (file.size > 2 * 1024 * 1024) {
      notices.push('An oversized WGS index was ignored.')
      continue
    }
    try {
      slots.push(
        ...readWgsIndex(new Uint8Array(await file.arrayBuffer())).map(
          (slot) => ({ scope: parent(path(file)), slot })
        )
      )
    } catch (error) {
      notices.push((error as Error).message)
    }
  }
  for (const file of files.filter((f) => /^container\.\d+$/.test(f.name))) {
    if (file.size > 16384) continue
    try {
      descriptors.push({
        parent: parent(path(file)),
        version: Number(file.name.split('.')[1]),
        blobs: readContainer(new Uint8Array(await file.arrayBuffer())),
      })
    } catch {
      notices.push(`${file.name}: the descriptor could not be read.`)
    }
  }
  let skipped = 0
  for (const file of files) {
    if (file.name === 'containers.index' || /^container\.\d+$/.test(file.name))
      continue
    if (file.size > MAX_SAVE_BYTES) {
      notices.push(`${file.name}: exceeds the 128 MiB save limit.`)
      continue
    }
    const header = new Uint8Array(await file.slice(0, 16).arrayBuffer())
    if (header[0] === 123 || header.length < 12) {
      skipped++
      continue
    }
    if (
      magic(header) !== 'SAVE' &&
      new DataView(
        header.buffer,
        header.byteOffset,
        header.byteLength
      ).getUint32(0, true) !== 12
    ) {
      skipped++
      continue
    }
    try {
      const result = await extractWorld(
        new Uint8Array(await file.arrayBuffer())
      )
      const source = path(file),
        folderPath = parent(source),
        folder = folderPath.split('/').pop()?.toUpperCase()
      const matches = slots.filter(
        ({ scope, slot }) =>
          folder === slot.folder && parent(folderPath) === scope
      )
      // When individual files are selected, a matching container descriptor can restore the association.
      if (!folderPath) {
        for (const { slot, scope } of slots) {
          if (scope) continue
          if (
            descriptors.some(
              (d) =>
                !d.parent &&
                d.version === slot.containerVersion &&
                d.blobs.includes(file.name.toUpperCase())
            )
          )
            matches.push({ slot, scope })
        }
      }
      let status: ImportedWorld['status'] = 'Unconfirmed'
      if (matches.length === 1) {
        const { slot } = matches[0]
        const descriptor = descriptors.find(
          (d) =>
            d.parent === folderPath &&
            d.version === slot.containerVersion &&
            (folderPath || d.blobs.includes(file.name.toUpperCase()))
        )
        if (descriptor && !descriptor.blobs.includes(file.name.toUpperCase())) {
          skipped++
          continue
        }
        if (slot.name !== result.name)
          throw new Error(
            'The WGS slot name does not match the internal world name.'
          )
        status = descriptor
          ? slot.backup
            ? 'Backup'
            : 'Current'
          : 'Unconfirmed'
      }
      worlds.push({ ...result, source, status, modified: file.lastModified })
    } catch (error) {
      notices.push(`${file.name}: ${(error as Error).message}`)
    }
  }
  worlds.sort(
    (a, b) =>
      ({ Current: 0, Unconfirmed: 1, Backup: 2 })[a.status] -
        { Current: 0, Unconfirmed: 1, Backup: 2 }[b.status] ||
      b.modified - a.modified
  )
  if (skipped)
    notices.push(
      `${skipped} character, unrelated or stale file${skipped === 1 ? '' : 's'} skipped.`
    )
  return { worlds, notices }
}
