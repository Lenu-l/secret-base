/**
 * Generate PWA icons from SVG using the canvas package.
 * Run: node scripts/generate-icons.cjs
 *
 * If you don't have the canvas package, install it:
 *   npm install canvas
 *
 * Or simply use the SVG favicon — it works fine in most browsers.
 * The PNG icons are only needed for PWA install prompts on some platforms.
 */

const fs = require('fs')
const path = require('path')

const ICONS_DIR = path.join(__dirname, '..', 'public', 'icons')
const SVG_PATH = path.join(ICONS_DIR, 'favicon.svg')
const SIZES = [48, 72, 96, 144, 192, 512]

async function generateIcons() {
  let canvas
  try {
    const { createCanvas, loadImage } = require('canvas')
    canvas = { createCanvas, loadImage }
  } catch {
    console.log('⚠️  canvas package not installed. Creating simple placeholder PNGs...')
    createSimplePNGs()
    return
  }

  const svgContent = fs.readFileSync(SVG_PATH, 'utf-8')
  const svgDataUrl = 'data:image/svg+xml;base64,' + Buffer.from(svgContent).toString('base64')

  for (const size of SIZES) {
    const c = canvas.createCanvas(size, size)
    const ctx = c.getContext('2d')

    const img = await canvas.loadImage(svgDataUrl)
    ctx.drawImage(img, 0, 0, size, size)

    const buffer = c.toBuffer('image/png')
    fs.writeFileSync(path.join(ICONS_DIR, `icon-${size}.png`), buffer)
    console.log(`✅ Generated icon-${size}.png`)
  }
}

function createSimplePNGs() {
  // Minimal valid 1x1 purple PNG as placeholder
  // Real icons will be generated when canvas is installed
  for (const size of SIZES) {
    const outputPath = path.join(ICONS_DIR, `icon-${size}.png`)
    if (fs.existsSync(outputPath)) {
      console.log(`⏭️  icon-${size}.png already exists`)
      continue
    }
    // Create a minimal PNG (purple pixel scaled up)
    const png = createMinimalPNG(size, 0xA7, 0x8B, 0xFA)
    fs.writeFileSync(outputPath, png)
    console.log(`✅ Created placeholder icon-${size}.png`)
  }
}

function createMinimalPNG(size, r, g, b) {
  // Create a minimal valid PNG file with a solid color
  // Uses filtered scanlines for better compression
  const signature = Buffer.from([137, 80, 78, 71, 13, 10, 26, 10])

  // IHDR chunk
  const ihdr = Buffer.alloc(13)
  ihdr.writeUInt32BE(size, 0)  // width
  ihdr.writeUInt32BE(size, 4)  // height
  ihdr[8] = 8   // bit depth
  ihdr[9] = 2   // color type (RGB)
  ihdr[10] = 0  // compression
  ihdr[11] = 0  // filter
  ihdr[12] = 0  // interlace

  // IDAT: raw image data with zlib
  const rawData = []
  for (let y = 0; y < size; y++) {
    rawData.push(0) // filter byte: None
    for (let x = 0; x < size; x++) {
      // Simple gradient circle design
      const cx = size / 2, cy = size / 2
      const dx = (x - cx) / cx, dy = (y - cy) / cy
      const dist = Math.sqrt(dx * dx + dy * dy)

      if (dist > 0.95) {
        // Dark background
        rawData.push(11, 16, 32)
      } else if (dist > 0.85) {
        // Purple ring
        rawData.push(r, g, b)
      } else if (dist < 0.3) {
        // Yellow center
        rawData.push(253, 230, 138)
      } else {
        // Gradient fill
        const t = (dist - 0.3) / 0.55
        rawData.push(
          Math.floor(r * (1 - t) + 253 * t * 0.3),
          Math.floor(g * (1 - t) + 230 * t * 0.3),
          Math.floor(b * (1 - t) + 138 * t * 0.3)
        )
      }
    }
  }

  // Compress with zlib
  const zlib = require('zlib')
  const compressed = zlib.deflateSync(Buffer.from(rawData))

  function makeChunk(type, data) {
    const length = Buffer.alloc(4)
    length.writeUInt32BE(data.length, 0)
    const typeBuffer = Buffer.from(type, 'ascii')
    const crc = crc32(Buffer.concat([typeBuffer, data]))
    const crcBuf = Buffer.alloc(4)
    crcBuf.writeUInt32BE(crc >>> 0, 0)
    return Buffer.concat([length, typeBuffer, data, crcBuf])
  }

  const ihdrChunk = makeChunk('IHDR', ihdr)
  const idatChunk = makeChunk('IDAT', compressed)
  const iendChunk = makeChunk('IEND', Buffer.alloc(0))

  return Buffer.concat([signature, ihdrChunk, idatChunk, iendChunk])
}

// CRC32 for PNG chunks
const crc32Table = new Int32Array(256)
for (let i = 0; i < 256; i++) {
  let c = i
  for (let j = 0; j < 8; j++) {
    c = (c & 1) ? (0xEDB88320 ^ (c >>> 1)) : (c >>> 1)
  }
  crc32Table[i] = c
}

function crc32(data) {
  let crc = 0xFFFFFFFF
  for (let i = 0; i < data.length; i++) {
    crc = crc32Table[(crc ^ data[i]) & 0xFF] ^ (crc >>> 8)
  }
  return (crc ^ 0xFFFFFFFF)
}

generateIcons().catch(console.error)
