export function shade(col: string, amt: number) {
  let usePound = false

  if (col[0] == '#') {
    col = col.slice(1)
    usePound = true
  }

  const num = parseInt(col, 16)

  let r = Math.round((num >> 16) * amt)

  if (r > 255) r = 255
  else if (r < 0) r = 0

  let b = Math.round(((num >> 8) & 0x00ff) * amt)

  if (b > 255) b = 255
  else if (b < 0) b = 0

  let g = Math.round((num & 0x0000ff) * amt)

  if (g > 255) g = 255
  else if (g < 0) g = 0

  let code = (g | (b << 8) | (r << 16)).toString(16)
  while (code.length < 6) code = '0' + code
  return (usePound ? '#' : '') + code
}
