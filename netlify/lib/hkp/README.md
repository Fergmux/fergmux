# HKP reader

`read-hkp` accepts POST JSON `{ filename, data }`, where `data` is the original file encoded as base64. It returns `{ profile, text }`. `profile.kind` identifies the shared or game-specific set independently of the filename. It does not store uploads or log their contents. Compressed input is limited to 256 KiB, inflated input to 2 MiB, and parsing validates record counts, flags, markers and complete consumption of the stream.

The user confirmed that the two supplied fixtures are unchanged default game bindings. The page immediately displays their pre-parsed snapshot from `src/data/aoeHotkeyDefaults.json`, with no initial server request. The snapshot also includes the original compressed bytes for editing defaults. To regenerate it after a parser/label update, run `pnpm test:hkp`, then `node scripts/generate-hkp-defaults.cjs`. Uploads replace the matching set only after successful conversion; errors preserve the displayed bindings. Each set can be restored independently, or both together. Hotkey groups start collapsed and search opens matching groups.

## Editing and HKP downloads

Click a binding to capture a keyboard shortcut or choose a key and modifiers. Mouse buttons, wheel directions, Tab and Escape can be selected from the picker. Changes are held in page memory and update search, counts and text exports immediately. Undo returns to the uploaded/default source; Restore defaults returns to the supplied defaults. Reserved entries cannot be edited. Each set has its own HKP download because shared and game-specific bindings belong in separate files.

`write-hkp` accepts POST JSON `{ filename, data, edits }`; `data` is the original compressed base64 file, and each edit is `{ groupIndex, hotkeyIndex, keyCode, ctrl, alt, shift }`. It returns an actual HKP attachment using a base64-encoded Netlify binary response. It validates the original file again, locates each selected record through the parser, changes only the four key-code bytes and three modifier bytes, and recompresses with raw DEFLATE. Client-supplied offsets and action IDs are never used for writing. Group/record positions preserve independent edits to duplicate action IDs. Unknown extra flag bytes, group markers and all other records are preserved. An export with no edits returns the original compressed bytes exactly.

Writer tests cover both supplied tagged files, both classic layouts, duplicate actions, unassignment, extra flags, invalid edits, and download/read round trips. Byte-level assertions verify that every byte outside the selected bindings stays unchanged. Compatibility has been checked structurally and by re-importing generated files in the reader; loading them in the game has not been tested.

The parser supports the classic DE layout (`0x40400000`, `0x40866666`) and the tagged layout (`0x408a3d71`) in the supplied September 2026 files. Unknown versions are rejected explicitly. Shared and game-specific files are detected from their structure, independently of filenames. Input order and duplicate action IDs are preserved, including reserved negative IDs and unassigned entries. Unknown positive IDs fall back to their numeric values. Additional flag bytes are retained, not interpreted.

The tagged layout was verified against `tests/fixtures/hkp/Hotkeys.hkp` (198 records, nine groups) and `Base.hkp` (456 records, 27 groups). It wraps the same 12-byte little-endian hotkey record in `HandlerBaseGroupBegin`, the header `0x00100a60`, `GroupHeaderGuard`, and `HandlerBaseGroupEnd`. Shared files have a group count before `baseHotkeysBegin/sharedHotkeyGroupsBegin`. Game-specific files have three named command groups, then counted detached groups. Tests validate all opening/closing markers and both full samples.

Group headings follow the standard Base/shared order. The later building and campaign headings, and Military Units, are verified against the installed game's `resources/_common/dat/hotkeys.json` and English language strings (2026-09-08). Unrecognised future groups retain numbered fallback headings. Punctuation labels use the US virtual-key layout; the extra ISO key is described by its position beside left Shift. Unknown key codes remain explicit.

References:

- [KSneijders' classic HKP format notes](https://gist.github.com/KSneijders/9231eeec1a66b314c3402729f0c455fa)
- [HotkeyEditor.com action dictionary](https://github.com/Patchnote-v2/hotkeyeditor.com/blob/main/src/hotkeys/hkp/strings.py) (MIT; see `THIRD_PARTY_LICENSE.txt`).
- `labels.json` starts from that dictionary and updates matching English labels from the user's installed AoE II: DE `resources/en/strings/key-value/key-value-strings-utf8.txt` and `key-value-paphos-strings-utf8.txt`, inspected on 2026-09-08. Only action IDs used in the dictionary or sample files are retained. The lookup is bundled and requires no network requests at runtime. Game labels belong to their respective owners.

Run `pnpm test:hkp` for parser and endpoint tests. Run the site with `pnpm netlify` (requires the Netlify CLI); bare `pnpm serve` does not serve Netlify functions. Visit `/#/projects/aoe-hotkeys`. To smoke-test the deployed endpoint, POST an original fixture encoded as base64 and check the totals above.
