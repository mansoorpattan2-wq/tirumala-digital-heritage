const sharp = require('sharp');
const fs = require('node:fs/promises');
const path = require('node:path');
const root = path.resolve(__dirname, '../public/images');
(async () => {
  const inputs = ['temple-day.jpg', 'temple-night.jpg', 'temple-midnight.jpg', 'hills.jpg', 'seven-hills-art.png', 'ritual-light-art.png'];
  for (const input of inputs) {
    const generated = input.endsWith('.png');
    const output = path.join(root, input.replace(/\.(jpg|png)$/, '.webp'));
    await sharp(path.join(root, input)).resize({ width: generated ? 2000 : 1800, withoutEnlargement: true }).webp({ quality: generated ? 86 : 82 }).toFile(output);
    const info = await sharp(output).metadata();
    const pixels = await sharp(output).raw().toBuffer();
    if (!pixels.length) throw new Error('Decoded image is empty: ' + output);
    console.log(JSON.stringify({ file: path.basename(output), bytes: (await fs.stat(output)).size, width: info.width, height: info.height, format: info.format, decodedBytes: pixels.length }));
  }
  const creditsPath = path.join(root, 'credits.json');
  const credits = JSON.parse(await fs.readFile(creditsPath, 'utf8'));
  for (const credit of credits) {
    credit.optimizedFile = credit.file.replace(/\.(jpg|png)$/, '.webp');
    credit.changes = credit.changes.replace('Original photograph;', 'Original photograph retained; optimized sibling resized to a maximum width of 1800 pixels and encoded as WebP;');
  }
  await fs.writeFile(creditsPath, JSON.stringify(credits, null, 2) + '\n');
})();
