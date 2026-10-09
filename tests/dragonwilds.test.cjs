const { test } = require('node:test')
const assert = require('node:assert/strict')
const { deflateSync } = require('node:zlib')
const {
  extractWorld,
  readWgsIndex,
  importWorlds,
  MAX_SAVE_BYTES,
} = require('../.netlify/dragonwilds-test/dragonwilds.js')

const u32 = (n) => {
  const b = Buffer.alloc(4)
  b.writeUInt32LE(n)
  return b
}
const i32 = (n) => {
  const b = Buffer.alloc(4)
  b.writeInt32LE(n)
  return b
}
const wide = (s) => Buffer.concat([u32(s.length), Buffer.from(s, 'utf16le')])
const str = (s, unicode = false) => {
  const data = Buffer.from(s + '\0', unicode ? 'utf16le' : 'utf8')
  return Buffer.concat([i32(unicode ? -data.length / 2 : data.length), data])
}
const chunk = (tag, data) =>
  Buffer.concat([Buffer.from(tag), u32(data.length), data])
function save(name = 'Test world', unicode = false) {
  const values = Buffer.concat([u32(9), str(name, unicode)])
  const info = Buffer.concat([
    u32(2),
    str('VERSION'),
    str('WorldName'),
    u32(2),
    u32(0),
    u32(4),
    u32(values.length),
    values,
  ])
  return chunk(
    'SAVE',
    Buffer.concat([
      chunk('INFO', chunk('CINF', info)),
      chunk('GLOB', Buffer.from([0, 1, 2, 3])),
    ])
  )
}
const wrapped = (bytes) =>
  Buffer.concat([u32(12), u32(65536), u32(bytes.length), deflateSync(bytes)])
const folderA = '01010101010101010101010101010101',
  folderB = '02020202020202020202020202020202'
const blobA = '03030303030303030303030303030303',
  blobB = '04040404040404040404040404040404'
const guidBytes = (hex) => Buffer.from(hex, 'hex') // Repeated-byte fixture GUIDs have the same byte order.
function index() {
  const header = Buffer.concat([
    u32(14),
    u32(2),
    u32(0),
    wide('JagexLimited.Dominion'),
    Buffer.alloc(12),
    wide('account'),
    Buffer.alloc(8),
  ])
  const record = (name, folder, version) =>
    Buffer.concat([
      wide(name),
      wide(name),
      wide('etag'),
      Buffer.from([version]),
      u32(1),
      guidBytes(folder),
      Buffer.alloc(24),
    ])
  return Buffer.concat([
    header,
    record('Test worldQxav', folderA, 5),
    record('Test worldQxavQbak', folderB, 4),
  ])
}
function descriptor(blob) {
  const label = Buffer.alloc(128)
  Buffer.from('Data', 'utf16le').copy(label)
  return Buffer.concat([
    u32(4),
    u32(1),
    label,
    guidBytes(blob),
    guidBytes(blob),
  ])
}
function file(name, bytes, path = '') {
  const f = new File([bytes], name, { lastModified: 1 })
  Object.defineProperty(f, 'webkitRelativePath', { value: path })
  return f
}

test('extracts identical world bytes and preserves spaces and Unicode', async () => {
  for (const [name, unicode] of [
    ['Test world', false],
    ['A world with spaces', false],
    ['世界 🐉', true],
  ]) {
    const original = save(name, unicode)
    const result = await extractWorld(wrapped(original))
    assert.equal(result.name, name)
    assert.deepEqual(Buffer.from(result.bytes), original)
  }
})
test('accepts an existing native save unchanged', async () => {
  const original = save()
  assert.deepEqual(Buffer.from((await extractWorld(original)).bytes), original)
})
test('rejects damaged compression, mismatched sizes, unsupported wrappers and truncated saves', async () => {
  const corrupt = wrapped(save())
  corrupt[corrupt.length - 1] ^= 0xff
  await assert.rejects(extractWorld(corrupt), /checksum/)
  const short = wrapped(save())
  short.writeUInt32LE(save().length - 1, 8)
  await assert.rejects(extractWorld(short), /exceeds/)
  const long = wrapped(save())
  long.writeUInt32LE(save().length + 1, 8)
  await assert.rejects(extractWorld(long), /does not match/)
  const other = wrapped(save())
  other.writeUInt32LE(1, 4)
  await assert.rejects(extractWorld(other), /Unsupported Xbox wrapper/)
  await assert.rejects(extractWorld(save().subarray(0, -1)), /complete/)
  const huge = wrapped(save())
  huge.writeUInt32LE(MAX_SAVE_BYTES + 1, 8)
  await assert.rejects(extractWorld(huge), /exceeds/)
})
test('rejects invalid chunk boundaries and unsafe filenames instead of renaming worlds', async () => {
  const invalid = save()
  invalid.writeUInt32LE(999999, 12)
  await assert.rejects(extractWorld(invalid), /truncated/)
  for (const name of ['../world', 'CON', 'world.'])
    await assert.rejects(extractWorld(save(name)), /filename/)
})
test('reads current and backup slots from the WGS index', () => {
  assert.deepEqual(
    readWgsIndex(index()).map((x) => [x.name, x.backup, x.folder]),
    [
      ['Test world', false, folderA],
      ['Test world', true, folderB],
    ]
  )
  const unknown = index()
  unknown.writeUInt32LE(99)
  assert.throws(() => readWgsIndex(unknown), /not supported/)
})
test('folder import identifies current/backup, skips characters and stale blobs', async () => {
  const files = [
    file('containers.index', index(), 'wgs/account/containers.index'),
  ]
  for (const [folder, blob, version] of [
    [folderA, blobA, 5],
    [folderB, blobB, 4],
  ]) {
    files.push(
      file(
        `container.${version}`,
        descriptor(blob),
        `wgs/account/${folder}/container.${version}`
      )
    )
    files.push(file(blob, wrapped(save()), `wgs/account/${folder}/${blob}`))
  }
  files.push(
    file('OLD', wrapped(save()), `wgs/account/${folderA}/OLD`),
    file('character', Buffer.from('{"Version":83}'), 'wgs/account/character')
  )
  const result = await importWorlds(files)
  assert.deepEqual(
    result.worlds.map((w) => w.status),
    ['Current', 'Backup']
  )
  assert.match(result.notices.join(), /2 character, unrelated or stale files/)
})
test('individual files use descriptors without confusing current/backup', async () => {
  const result = await importWorlds([
    file('containers.index', index()),
    file('container.5', descriptor(blobA)),
    file('container.4', descriptor(blobB)),
    file(blobA, wrapped(save())),
    file(blobB, wrapped(save())),
  ])
  assert.deepEqual(
    result.worlds.map((w) => w.status),
    ['Current', 'Backup']
  )
})
test('missing metadata leaves status unconfirmed and character-only import yields no worlds', async () => {
  assert.equal(
    (await importWorlds([file(blobA, wrapped(save()))])).worlds[0].status,
    'Unconfirmed'
  )
  assert.equal(
    (await importWorlds([file('character', Buffer.from('{"Version":83}'))]))
      .worlds.length,
    0
  )
})
test('index/name conflicts refuse extraction and oversized imports are refused', async () => {
  const result = await importWorlds([
    file('containers.index', index(), 'wgs/account/containers.index'),
    file(blobA, wrapped(save('Wrong name')), `wgs/account/${folderA}/${blobA}`),
  ])
  assert.equal(result.worlds.length, 0)
  assert.match(result.notices.join(), /does not match/)
  await assert.rejects(importWorlds([{ size: 257 * 1024 * 1024 }]), /256 MiB/)
})
