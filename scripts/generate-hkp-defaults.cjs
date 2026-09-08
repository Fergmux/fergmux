// Run pnpm test:hkp first to compile the parser used by the Netlify function.
const { readFileSync, writeFileSync } = require('node:fs')
const { join } = require('node:path')
const {
  parseHkp,
  profileText,
} = require('../.netlify/hkp-test/lib/hkp/parser.js')

const defaults = ['Hotkeys.hkp', 'Base.hkp'].map((filename) => {
  const data = readFileSync(join(__dirname, '../tests/fixtures/hkp', filename))
  const profile = parseHkp(
    data,
    filename
  )
  return { profile, text: profileText(profile), data: data.toString('base64') }
})

writeFileSync(
  join(__dirname, '../src/data/aoeHotkeyDefaults.json'),
  JSON.stringify(defaults, null, 2) + '\n'
)
