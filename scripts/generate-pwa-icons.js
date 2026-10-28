// Generate PWA icons from the fitforg logo
// Source: /public/fitforg-logo.png (1254x1254 RGBA)
// Outputs: apple-touch-icon, favicon, icon-192, icon-256, icon-384, icon-512,
//          icon-maskable-512 (with safe padding for Android adaptive icons)

const sharp = require('sharp')
const path = require('path')
const fs = require('fs')

const SRC = path.join(__dirname, '..', 'public', 'fitforg-logo.png')
const OUT_DIR = path.join(__dirname, '..', 'public')

async function generateIcon(size, filename) {
  const out = path.join(OUT_DIR, filename)
  await sharp(SRC)
    .resize(size, size, { fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 1 } })
    .png()
    .toFile(out)
  console.log(`✓ ${filename} (${size}x${size})`)
}

// Maskable icons need ~10% safe padding so the icon doesn't get cropped
// on different Android shapes (circle, squircle, etc.)
async function generateMaskable(size, filename) {
  const out = path.join(OUT_DIR, filename)
  // Create a black canvas at full size, then composite the logo at 80% scale,
  // centered — gives us the safe-zone padding Google recommends.
  const innerSize = Math.round(size * 0.8)
  const offset = Math.round((size - innerSize) / 2)

  const innerBuffer = await sharp(SRC)
    .resize(innerSize, innerSize, { fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 1 } })
    .png()
    .toBuffer()

  await sharp({
    create: {
      width: size,
      height: size,
      channels: 4,
      background: { r: 0, g: 0, b: 0, alpha: 1 },
    },
  })
    .composite([{ input: innerBuffer, left: offset, top: offset }])
    .png()
    .toFile(out)
  console.log(`✓ ${filename} (${size}x${size}, maskable)`)
}

async function main() {
  if (!fs.existsSync(SRC)) {
    console.error(`Source not found: ${SRC}`)
    process.exit(1)
  }

  // Standard icons
  await generateIcon(16, 'favicon-16x16.png')
  await generateIcon(32, 'favicon-32x32.png')
  await generateIcon(180, 'apple-touch-icon.png')
  await generateIcon(192, 'icon-192.png')
  await generateIcon(256, 'icon-256.png')
  await generateIcon(384, 'icon-384.png')
  await generateIcon(512, 'icon-512.png')

  // Maskable icons (Android adaptive)
  await generateMaskable(192, 'icon-maskable-192.png')
  await generateMaskable(512, 'icon-maskable-512.png')

  // Also overwrite the favicon used by browsers directly
  await generateIcon(32, 'favicon.ico.png')

  console.log('\nAll PWA icons generated.')
}

main().catch(err => {
  console.error(err)
  process.exit(1)
})
