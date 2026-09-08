// KeyboardEvent.code describes physical keys; HKP uses Windows virtual-key codes.
// Keep the mapping explicit so numpad and punctuation keys are not mistaken for
// their shifted characters. Mouse bindings are available in the editor's picker.
const codes: Record<string, number> = {
  Backspace: 8,
  Tab: 9,
  Enter: 13,
  NumpadEnter: 13,
  Pause: 19,
  CapsLock: 20,
  Escape: 27,
  Space: 32,
  PageUp: 33,
  PageDown: 34,
  End: 35,
  Home: 36,
  ArrowLeft: 37,
  ArrowUp: 38,
  ArrowRight: 39,
  ArrowDown: 40,
  PrintScreen: 44,
  Insert: 45,
  Delete: 46,
  ContextMenu: 93,
  NumpadMultiply: 106,
  NumpadAdd: 107,
  NumpadComma: 108,
  NumpadSubtract: 109,
  NumpadDecimal: 110,
  NumpadDivide: 111,
  NumLock: 144,
  ScrollLock: 145,
  Semicolon: 186,
  Equal: 187,
  Comma: 188,
  Minus: 189,
  Period: 190,
  Slash: 191,
  Backquote: 192,
  BracketLeft: 219,
  Backslash: 220,
  BracketRight: 221,
  Quote: 222,
  IntlBackslash: 226,
}

export function hkpKeyCode(code: string): number | null {
  if (/^Key[A-Z]$/.test(code)) return code.charCodeAt(3)
  if (/^Digit[0-9]$/.test(code)) return code.charCodeAt(5)
  if (/^Numpad[0-9]$/.test(code)) return 96 + Number(code.slice(6))
  if (/^F([1-9]|1[0-9]|2[0-4])$/.test(code)) return 111 + Number(code.slice(1))
  return codes[code] ?? null
}
