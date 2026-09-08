export interface Hotkey {
  id: number
  byteOffset: number
  action: string
  keyCode: number
  binding: string
  ctrl: boolean
  alt: boolean
  shift: boolean
  extra: number
  known: boolean
}
export interface HotkeyGroup {
  name: string
  hotkeys: Hotkey[]
}
export interface HotkeyProfile {
  filename: string
  kind: 'shared' | 'game-specific'
  format: string
  version: string
  groups: HotkeyGroup[]
  warnings: string[]
  total: number
  assigned: number
}

export const keyNames: Record<number, string> = {
  8: 'Backspace',
  9: 'Tab',
  12: 'Clear',
  13: 'Enter',
  16: 'Shift',
  17: 'Ctrl',
  18: 'Alt',
  19: 'Pause',
  20: 'Caps Lock',
  27: 'Escape',
  32: 'Space',
  33: 'Page Up',
  34: 'Page Down',
  35: 'End',
  36: 'Home',
  37: 'Left Arrow',
  38: 'Up Arrow',
  39: 'Right Arrow',
  40: 'Down Arrow',
  44: 'Print Screen',
  45: 'Insert',
  46: 'Delete',
  91: 'Left Windows',
  92: 'Right Windows',
  93: 'Menu',
  106: 'Numpad *',
  107: 'Numpad +',
  108: 'Numpad Separator',
  109: 'Numpad -',
  110: 'Numpad .',
  111: 'Numpad /',
  144: 'Num Lock',
  145: 'Scroll Lock',
  160: 'Left Shift',
  161: 'Right Shift',
  162: 'Left Ctrl',
  163: 'Right Ctrl',
  164: 'Left Alt',
  165: 'Right Alt',
  186: ';',
  187: '=',
  188: ',',
  189: '-',
  190: '.',
  191: '/',
  192: '`',
  219: '[',
  220: '\\',
  221: ']',
  222: "'",
  226: 'Extra key beside left Shift (\\ / <)',
  251: 'Mouse Button 5',
  252: 'Mouse Button 4',
  253: 'Middle Mouse',
  254: 'Mouse Wheel Down',
  255: 'Mouse Wheel Up',
}

export function keyName(code: number): string {
  if (code === 0) return 'Unassigned'
  if ((code >= 65 && code <= 90) || (code >= 48 && code <= 57))
    return String.fromCharCode(code)
  if (code >= 112 && code <= 135) return `F${code - 111}`
  if (code >= 96 && code <= 105) return `Numpad ${code - 96}`
  return keyNames[code] ?? `Key code ${code}`
}

export interface Binding {
  keyCode: number
  ctrl: boolean
  alt: boolean
  shift: boolean
}

export interface BindingEdit extends Binding {
  groupIndex: number
  hotkeyIndex: number
}

export function formatBinding(binding: Binding): string {
  return binding.keyCode === 0
    ? 'Unassigned'
    : [
        binding.ctrl && 'Ctrl',
        binding.alt && 'Alt',
        binding.shift && 'Shift',
        keyName(binding.keyCode),
      ]
        .filter(Boolean)
        .join(' + ')
}

export function profileText(profile: HotkeyProfile): string {
  return [
    `${profile.filename} — Age of Empires II: Definitive Edition`,
    `${profile.format} (${profile.version})`,
    `${profile.total} entries · ${profile.assigned} assigned`,
    ...profile.warnings,
    '',
    ...profile.groups.flatMap((group) => [
      `[${group.name}]`,
      ...group.hotkeys.map(
        (hotkey) =>
          `${hotkey.action}: ${hotkey.binding} [ID ${hotkey.id}; key ${hotkey.keyCode}${hotkey.extra ? `; extra flag ${hotkey.extra}` : ''}]`
      ),
      '',
    ]),
  ].join('\n')
}
