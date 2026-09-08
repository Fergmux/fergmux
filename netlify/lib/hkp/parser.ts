import { deflateRawSync, inflateRawSync } from 'node:zlib'
import labels from './labels.json'
import {
  formatBinding,
  type Hotkey,
  type HotkeyGroup,
  type HotkeyProfile,
} from './format'
export { keyName, profileText } from './format'
export type { Hotkey, HotkeyGroup, HotkeyProfile } from './format'

export const MAX_FILE_BYTES = 256 * 1024
const MAX_INFLATED_BYTES = 2 * 1024 * 1024
const names: Record<string, string> = labels

class Reader {
  offset = 0
  constructor(readonly data: Buffer) {}
  require(length: number) {
    if (this.offset + length > this.data.length)
      throw new Error('The hotkey file is truncated.')
  }
  uint() {
    this.require(4)
    const value = this.data.readUInt32LE(this.offset)
    this.offset += 4
    return value
  }
  count() {
    const value = this.uint()
    if (value > 10000) throw new Error('Invalid hotkey or group count.')
    return value
  }
  marker(value: string) {
    this.require(value.length)
    if (
      this.data.toString('ascii', this.offset, this.offset + value.length) !==
      value
    ) {
      throw new Error('Unrecognised or damaged HKP structure.')
    }
    this.offset += value.length
  }
  hotkey(tagged: boolean): Hotkey {
    if (tagged) {
      this.marker('HandlerBaseGroupBegin')
      if (this.uint() !== 0x00100a60)
        throw new Error('Unsupported HKP record header.')
      this.marker('GroupHeaderGuard')
    }
    this.require(12)
    const byteOffset = this.offset
    const keyCode = this.data.readUInt32LE(this.offset)
    const id = this.data.readInt32LE(this.offset + 4)
    const flags = [...this.data.subarray(this.offset + 8, this.offset + 11)]
    if (flags.some((flag) => flag > 1))
      throw new Error('Invalid hotkey modifier flags.')
    const [ctrl, alt, shift] = flags.map(Boolean)
    const extra = this.data[this.offset + 11]
    this.offset += 12
    if (tagged) this.marker('HandlerBaseGroupEnd')
    const binding = formatBinding({ keyCode, ctrl, alt, shift })
    return {
      id,
      byteOffset,
      action:
        names[id] ??
        (id < 0 ? `Reserved entry (${id})` : `Unknown action (${id})`),
      keyCode,
      binding,
      ctrl,
      alt,
      shift,
      extra,
      known: id < 0 || Boolean(names[id]),
    }
  }
  group(name: string, tagged: boolean, detached = false): HotkeyGroup {
    const count = this.count()
    if (detached) this.marker('detachedHotkeysGroupBegin')
    const hotkeys = Array.from({ length: count }, () => this.hotkey(tagged))
    if (detached) this.marker('detachedHotkeysGroupEnd')
    return { name, hotkeys }
  }
  end() {
    if (this.offset !== this.data.length)
      throw new Error(
        'Unexpected data after the hotkey groups; this format may be newer than the reader.'
      )
  }
}

const sharedGroups = [
  'Shared commands',
  'Game commands',
  'Selection',
  'Control groups',
  'Scrolling and camera',
  'Spectator commands',
  'Military Units',
  'Zoom',
  'Gate commands',
]
// Names and order verified against the installed game's resources/_common/dat/
// hotkeys.json and English language strings (2026-09-08).
const detachedGroups = [
  'Villager build commands',
  'Town Center',
  'Dock',
  'Barracks',
  'Archery Range',
  'Stable',
  'Siege Workshop',
  'Monastery',
  'Market',
  'Castle',
  'Mill',
  'Mining Camp',
  'Lumber Camp',
  'Blacksmith',
  'University',
  'Mule Cart',
  'Donjon',
  'Settlement',
  'Fort',
  'Port',
  'Shipyard',
  'Outpost',
  'Campaign: Battle for Greece',
  'Campaign: Alexander the Great',
]

function readGroups(
  data: Buffer,
  tagged: boolean,
  additional: boolean
): HotkeyGroup[] {
  const r = new Reader(data)
  r.uint()
  const groups: HotkeyGroup[] = []
  if (additional) {
    if (tagged) r.marker('additionalHotkeysBegin')
    for (const [marker, name] of [
      ['allUnitCommandHotkeys', 'Unit commands'],
      ['allGameCommandHotkeys', 'Game commands'],
      ['allCycleCommandHotkeys', 'Cycle commands'],
    ]) {
      if (tagged) r.marker(`${marker}Begin`)
      groups.push(r.group(name, tagged))
      if (tagged) r.marker(`${marker}End`)
    }
    if (tagged) r.marker('detachedHotkeyGroupsBegin')
    const count = r.count()
    for (let i = 0; i < count; i++)
      groups.push(
        r.group(
          detachedGroups[i] ?? `Additional group ${i + 1}`,
          tagged,
          tagged
        )
      )
    if (tagged) {
      r.marker('detachedHotkeyGroupsEnd')
      r.marker('additionalHotkeysEnd')
    }
  } else {
    const count = r.count()
    if (tagged) {
      r.marker('baseHotkeysBegin')
      r.marker('sharedHotkeyGroupsBegin')
    }
    for (let i = 0; i < count; i++)
      groups.push(r.group(sharedGroups[i] ?? `Shared group ${i + 1}`, tagged))
    if (tagged) {
      r.marker('sharedHotkeyGroupsEnd')
      r.marker('baseHotkeysEnd')
    }
  }
  r.end()
  return groups
}

function readHkp(
  input: Buffer,
  filename: string
): { data: Buffer; profile: HotkeyProfile } {
  if (!input.length || input.length > MAX_FILE_BYTES)
    throw new Error('Choose a non-empty HKP file smaller than 256 KB.')
  let data: Buffer
  try {
    // Node's typings do not expose the info:true return shape.
    const result = inflateRawSync(input, {
      maxOutputLength: MAX_INFLATED_BYTES,
      info: true,
    }) as unknown as { buffer: Buffer; engine: { bytesWritten: number } }
    if (result.engine.bytesWritten !== input.length)
      throw new Error('Trailing compressed data')
    data = result.buffer
  } catch {
    throw new Error(
      'Cannot decompress this file. Choose an original AoE II: DE .hkp file (up to 2 MB decompressed).'
    )
  }
  if (data.length < 8) throw new Error('The hotkey file is truncated.')
  const version = data.readUInt32LE(0)
  const tagged = version === 0x408a3d71
  if (!tagged && ![0x40400000, 0x40866666].includes(version)) {
    throw new Error(`Unsupported HKP version 0x${version.toString(16)}.`)
  }
  let groups: HotkeyGroup[]
  let additional: boolean
  if (tagged) {
    additional = data.toString('ascii', 4, 26) === 'additionalHotkeysBegin'
    groups = readGroups(data, true, additional)
  } else {
    // Detect by complete structure, so renamed files work too.
    try {
      groups = readGroups(data, false, false)
      additional = false
    } catch {
      groups = readGroups(data, false, true)
      additional = true
    }
  }
  const hotkeys = groups.flatMap((group) => group.hotkeys)
  const unknown = hotkeys.filter((hotkey) => !hotkey.known).length
  const warnings: string[] = []
  if (unknown)
    warnings.push(
      `${unknown} action labels are unavailable; their original IDs are shown.`
    )
  if (hotkeys.some((hotkey) => hotkey.extra !== 0))
    warnings.push(
      'Some records contain an additional flag. Its raw value is included in the text export.'
    )
  return {
    data,
    profile: {
      filename,
      kind: additional ? 'game-specific' : 'shared',
      format: `${tagged ? 'Tagged' : 'Classic'} HKP · ${additional ? 'game-specific' : 'shared'}`,
      version: `0x${version.toString(16)}`,
      groups,
      warnings,
      total: hotkeys.length,
      assigned: hotkeys.filter((hotkey) => hotkey.keyCode !== 0).length,
    },
  }
}

export function parseHkp(input: Buffer, filename: string): HotkeyProfile {
  return readHkp(input, filename).profile
}

export function editHkp(
  input: Buffer,
  filename: string,
  edits: unknown
): Buffer {
  if (!Array.isArray(edits) || edits.length > 10000)
    throw new Error('Provide a valid list of binding edits.')
  const { data, profile } = readHkp(input, filename)
  const visited = new Set<string>()
  for (const edit of edits) {
    if (
      !edit ||
      !Number.isInteger(edit.groupIndex) ||
      edit.groupIndex < 0 ||
      !Number.isInteger(edit.hotkeyIndex) ||
      edit.hotkeyIndex < 0
    )
      throw new Error('Invalid binding position.')
    const hotkey = profile.groups[edit.groupIndex]?.hotkeys[edit.hotkeyIndex]
    if (!hotkey || hotkey.id <= 0)
      throw new Error('This entry cannot be edited.')
    const position = `${edit.groupIndex}:${edit.hotkeyIndex}`
    if (visited.has(position))
      throw new Error('Duplicate edit for the same binding.')
    visited.add(position)
    if (
      !Number.isInteger(edit.keyCode) ||
      edit.keyCode < 0 ||
      edit.keyCode > 255 ||
      ['ctrl', 'alt', 'shift'].some((flag) => typeof edit[flag] !== 'boolean')
    )
      throw new Error('Choose a valid key and modifier combination.')
    // Offsets come from parsing the original, never from the request. Action IDs,
    // duplicate records, extra flags, version and all group markers stay intact.
    data.writeUInt32LE(edit.keyCode, hotkey.byteOffset)
    data[hotkey.byteOffset + 8] = edit.keyCode && edit.ctrl ? 1 : 0
    data[hotkey.byteOffset + 9] = edit.keyCode && edit.alt ? 1 : 0
    data[hotkey.byteOffset + 10] = edit.keyCode && edit.shift ? 1 : 0
  }
  return edits.length ? deflateRawSync(data) : input
}
