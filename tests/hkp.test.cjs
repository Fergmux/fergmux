const { test } = require('node:test')
const assert = require('node:assert/strict')
const { readFileSync } = require('node:fs')
const { deflateRawSync, inflateRawSync } = require('node:zlib')
const {
  parseHkp,
  editHkp,
  profileText,
  keyName,
  MAX_FILE_BYTES,
} = require('../.netlify/hkp-test/lib/hkp/parser.js')
const { handler } = require('../.netlify/hkp-test/functions/read-hkp.js')
const {
  handler: writeHandler,
} = require('../.netlify/hkp-test/functions/write-hkp.js')
const sample = (name) => readFileSync(`${__dirname}/fixtures/hkp/${name}.hkp`)
const upload = (filename, data) => ({
  httpMethod: 'POST',
  body: JSON.stringify({ filename, data: data.toString('base64') }),
})

const changedBinding = {
  groupIndex: 0,
  hotkeyIndex: 0,
  keyCode: 65,
  ctrl: true,
  alt: true,
  shift: true,
}

test('editing both tagged samples preserves every byte outside the selected binding', () => {
  for (const name of ['Hotkeys', 'Base']) {
    const original = sample(name)
    assert.deepEqual(editHkp(original, `${name}.hkp`, []), original)
    const before = inflateRawSync(original)
    const offset = parseHkp(original, `${name}.hkp`).groups[0].hotkeys[0]
      .byteOffset
    // An additional flag must survive editing even though its meaning is unknown.
    before[offset + 11] = 42
    const withExtra = deflateRawSync(before)
    const output = editHkp(withExtra, `${name}.hkp`, [changedBinding])
    const after = inflateRawSync(output)
    assert.equal(after.length, before.length)
    const mutable = new Set([0, 1, 2, 3, 8, 9, 10].map((n) => offset + n))
    for (let i = 0; i < before.length; i++)
      if (!mutable.has(i))
        assert.equal(after[i], before[i], `Unexpected change at byte ${i}`)
    const profile = parseHkp(output, `${name}.hkp`)
    assert.equal(profile.groups[0].hotkeys[0].binding, 'Ctrl + Alt + Shift + A')
    assert.equal(profile.groups[0].hotkeys[0].extra, 42)
    assert.equal(profile.total, name === 'Base' ? 456 : 198)
  }
})

test('edits the selected occurrence of a duplicate action and normalizes unassigned modifiers', () => {
  const input = sample('Hotkeys')
  const profile = parseHkp(input, 'Hotkeys.hkp')
  const positions = profile.groups
    .flatMap((group, groupIndex) =>
      group.hotkeys.map((hotkey, hotkeyIndex) => ({
        groupIndex,
        hotkeyIndex,
        hotkey,
      }))
    )
    .filter((p) => p.hotkey.id === 19023)
  assert.equal(positions.length, 2)
  const first = positions[0],
    second = positions[1]
  const edited = parseHkp(
    editHkp(input, 'Hotkeys.hkp', [
      {
        ...changedBinding,
        groupIndex: second.groupIndex,
        hotkeyIndex: second.hotkeyIndex,
        keyCode: 0,
      },
    ]),
    'Hotkeys.hkp'
  )
  assert.deepEqual(
    edited.groups[first.groupIndex].hotkeys[first.hotkeyIndex],
    first.hotkey
  )
  const unassigned =
    edited.groups[second.groupIndex].hotkeys[second.hotkeyIndex]
  assert.equal(unassigned.binding, 'Unassigned')
  assert.deepEqual(
    [unassigned.ctrl, unassigned.alt, unassigned.shift],
    [false, false, false]
  )
})

test('rejects invalid or reserved edits instead of writing a partial file', () => {
  const input = sample('Hotkeys')
  for (const edit of [
    { ...changedBinding, groupIndex: -1 },
    { ...changedBinding, hotkeyIndex: 10000 },
    { ...changedBinding, keyCode: 256 },
    { ...changedBinding, keyCode: 1.5 },
    { ...changedBinding, ctrl: 1 },
    null,
  ])
    assert.throws(() => editHkp(input, 'Hotkeys.hkp', [edit]))
  assert.throws(() =>
    editHkp(input, 'Hotkeys.hkp', [changedBinding, changedBinding])
  )
  assert.throws(() => editHkp(input, 'Hotkeys.hkp', {}))
  assert.throws(() => editHkp(input, 'Hotkeys.hkp', new Array(10001)))
  const profile = parseHkp(input, 'Hotkeys.hkp')
  const groupIndex = profile.groups.findIndex((group) =>
    group.hotkeys.some((hotkey) => hotkey.id < 0)
  )
  const hotkeyIndex = profile.groups[groupIndex].hotkeys.findIndex(
    (hotkey) => hotkey.id < 0
  )
  assert.throws(() =>
    editHkp(input, 'Hotkeys.hkp', [
      { ...changedBinding, groupIndex, hotkeyIndex },
    ])
  )
})

test('download endpoint produces a real HKP and rejects invalid requests', async () => {
  const event = upload('Renamed.hkp', sample('Base'))
  event.body = JSON.stringify({
    ...JSON.parse(event.body),
    edits: [changedBinding],
  })
  const response = await writeHandler(event)
  assert.equal(response.statusCode, 200)
  assert.equal(response.isBase64Encoded, true)
  assert.equal(response.headers['Content-Type'], 'application/octet-stream')
  assert.match(response.headers['Content-Disposition'], /Renamed.hkp/)
  const downloaded = Buffer.from(response.body, 'base64')
  const reread = JSON.parse(
    (await handler(upload('Renamed.hkp', downloaded))).body
  )
  assert.equal(
    reread.profile.groups[0].hotkeys[0].binding,
    'Ctrl + Alt + Shift + A'
  )
  assert.equal(reread.profile.total, 456)
  assert.equal(
    (
      await writeHandler({
        ...event,
        body: Buffer.from(event.body).toString('base64'),
        isBase64Encoded: true,
      })
    ).statusCode,
    200
  )
  for (const body of [
    '{',
    'null',
    JSON.stringify({ filename: '../bad.hkp', data: 'AAAA', edits: [] }),
    JSON.stringify({ filename: 'bad.hkp', data: '!!!!', edits: [] }),
    JSON.stringify({ ...JSON.parse(event.body), edits: null }),
  ])
    assert.equal(
      (await writeHandler({ httpMethod: 'POST', body })).statusCode,
      400
    )
  assert.equal((await writeHandler({ httpMethod: 'GET' })).statusCode, 405)
  assert.equal(
    (
      await writeHandler({
        httpMethod: 'POST',
        body: 'x'.repeat(2 * 1024 * 1024 + 1),
      })
    ).statusCode,
    413
  )
})

test('reads both supplied tagged formats with every action labelled and duplicate bindings preserved', () => {
  const shared = parseHkp(sample('Hotkeys'), 'renamed.hkp')
  const base = parseHkp(sample('Base'), 'also-renamed.hkp')
  assert.equal(shared.total, 198)
  assert.equal(base.total, 456)
  assert.equal(shared.groups.length, 9)
  assert.equal(base.groups.length, 27)
  assert.deepEqual(shared.warnings, [])
  assert.deepEqual(base.warnings, [])
  assert.equal(shared.groups[0].hotkeys[0].binding, 'Delete')
  assert.equal(shared.groups[0].hotkeys[1].binding, 'Shift + Delete')
  const idle = shared.groups
    .flatMap((g) => g.hotkeys)
    .filter((k) => k.id === 19023)
  assert.equal(idle.length, 2)
  assert.ok(
    profileText(shared).includes('Delete Unit: Delete [ID 19000; key 46]')
  )
  assert.ok(profileText(base).includes('Villager'))
})

function integer(n) {
  const b = Buffer.alloc(4)
  b.writeUInt32LE(n)
  return b
}
function classic(additional) {
  const record = Buffer.alloc(12)
  record.writeUInt32LE(255)
  record.writeInt32LE(999999, 4)
  record[8] = record[9] = record[10] = 1
  return deflateRawSync(
    Buffer.concat([
      integer(0x40866666),
      ...(additional ? [integer(0), integer(0), integer(0)] : []),
      integer(1),
      integer(2),
      record,
      record,
    ])
  )
}
test('classic profile and Base formats are detected by structure; unknown IDs and duplicates remain visible', () => {
  for (const additional of [false, true]) {
    const p = parseHkp(classic(additional), 'renamed.hkp')
    assert.equal(p.total, 2)
    assert.equal(
      p.groups.at(-1).hotkeys[0].binding,
      'Ctrl + Alt + Shift + Mouse Wheel Up'
    )
    assert.match(profileText(p), /Unknown action \(999999\)/)
    assert.equal(p.warnings.length, 1)
    const changed = parseHkp(
      editHkp(classic(additional), 'renamed.hkp', [
        { ...changedBinding, groupIndex: additional ? 3 : 0, keyCode: 253 },
      ]),
      'renamed.hkp'
    )
    assert.equal(
      changed.groups.at(-1).hotkeys[0].binding,
      'Ctrl + Alt + Shift + Middle Mouse'
    )
    assert.deepEqual(
      changed.groups.at(-1).hotkeys[1],
      p.groups.at(-1).hotkeys[1]
    )
  }
})
test('formats keys, numpad, mouse and unknown key codes without guessing', () => {
  for (const [code, label] of [
    [0, 'Unassigned'],
    [65, 'A'],
    [49, '1'],
    [112, 'F1'],
    [96, 'Numpad 0'],
    [253, 'Middle Mouse'],
    [254, 'Mouse Wheel Down'],
    [188, ','],
    [1000, 'Key code 1000'],
  ])
    assert.equal(keyName(code), label)
})
test('rejects corrupt streams, truncated records, bad tags, unsupported versions and trailing data', () => {
  const raw = inflateRawSync(sample('Hotkeys'))
  const badTag = Buffer.from(raw)
  badTag[51] = 0
  const badVersion = Buffer.from(raw)
  badVersion.writeUInt32LE(0x50000000)
  const badCount = Buffer.from(raw)
  badCount.writeUInt32LE(999999, 4)
  const badFlag = Buffer.from(raw)
  badFlag[100] = 2
  for (const bytes of [
    Buffer.from('not a hotkey file'),
    sample('Hotkeys').subarray(0, 30),
    deflateRawSync(raw.subarray(0, -1)),
    deflateRawSync(badTag),
    deflateRawSync(badVersion),
    deflateRawSync(badCount),
    deflateRawSync(badFlag),
    deflateRawSync(Buffer.concat([raw, Buffer.from('extra')])),
    Buffer.concat([sample('Hotkeys'), Buffer.from('extra')]),
  ])
    assert.throws(() => parseHkp(bytes, 'test.hkp'))
})
test('limits compressed and decompressed input sizes', () => {
  assert.throws(() => parseHkp(Buffer.alloc(MAX_FILE_BYTES + 1), 'test.hkp'))
  assert.throws(() =>
    parseHkp(deflateRawSync(Buffer.alloc(2 * 1024 * 1024 + 1)), 'test.hkp')
  )
})
test('endpoint returns readable output and actionable errors', async () => {
  const success = await handler(upload('Base.hkp', sample('Base')))
  assert.equal(success.statusCode, 200)
  assert.equal(JSON.parse(success.body).profile.total, 456)
  assert.equal(success.headers['Cache-Control'], 'no-store')
  assert.equal((await handler({ httpMethod: 'GET' })).statusCode, 405)
  assert.equal(
    (await handler({ httpMethod: 'POST', body: '{' })).statusCode,
    400
  )
  assert.equal(
    (await handler(upload('bad.txt', sample('Base')))).statusCode,
    400
  )
  assert.equal(
    (await handler(upload('bad\nname.hkp', sample('Base')))).statusCode,
    400
  )
  assert.equal(
    (
      await handler({
        httpMethod: 'POST',
        body: JSON.stringify({ filename: 'bad.hkp', data: '!!!!' }),
      })
    ).statusCode,
    400
  )
  assert.equal(
    (await handler({ httpMethod: 'POST', body: 'x'.repeat(400000) }))
      .statusCode,
    413
  )
  const event = upload('Hotkeys.hkp', sample('Hotkeys'))
  assert.equal(
    (
      await handler({
        ...event,
        body: Buffer.from(event.body).toString('base64'),
        isBase64Encoded: true,
      })
    ).statusCode,
    200
  )
})
