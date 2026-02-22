import QRCode from 'qrcode';
import { mkdir, writeFile } from 'node:fs/promises';
import { dirname, extname, join } from 'node:path';
import { parseArgs } from 'node:util';

const BASE_URL = 'https://chattanooga-adventures.web.app';
const QR_ROOT = join(import.meta.dirname, '..', 'QR_Codes');

const DEFAULT_OPTIONS = {
  width: 400,
  errorCorrectionLevel: 'H',
  margin: 2,
};

const GENERAL_PAGES = [
  { name: 'homepage', path: '/' },
  { name: 'support', path: '/support' },
];

async function generateQR(url, outputPath, options = {}) {
  const opts = { ...DEFAULT_OPTIONS, ...options };
  await mkdir(dirname(outputPath), { recursive: true });

  const ext = extname(outputPath).toLowerCase();
  if (ext === '.svg') {
    const svg = await QRCode.toString(url, { type: 'svg', ...opts });
    await writeFile(outputPath, svg, 'utf-8');
  } else {
    await QRCode.toFile(outputPath, url, opts);
  }

  console.log(`  ${outputPath} -> ${url}`);
}

async function generateAdventure(box, adventureId, format) {
  const url = `${BASE_URL}/adventure?box=${encodeURIComponent(box)}&adventure=${encodeURIComponent(adventureId)}`;
  const dir = join(QR_ROOT, 'adventures', box);
  const file = join(dir, `${adventureId}.${format}`);
  await generateQR(url, file);
}

async function generateGeneral(format) {
  console.log('Generating general site QR codes...');
  for (const page of GENERAL_PAGES) {
    const url = page.path === '/' ? BASE_URL : `${BASE_URL}${page.path}`;
    const file = join(QR_ROOT, 'General', `${page.name}.${format}`);
    await generateQR(url, file);
  }
}

function printUsage() {
  console.log(`
Usage:
  node scripts/generate-qr.js --general
    Generate QR codes for all general site pages (homepage, support).

  node scripts/generate-qr.js --adventure <box> <id>
    Generate a QR code for a specific adventure.
    Example: node scripts/generate-qr.js --adventure original 3

  node scripts/generate-qr.js --url <url> --output <path>
    Generate a QR code for any URL.
    Example: node scripts/generate-qr.js --url "https://example.com" --output QR_Codes/custom.png

Options:
  --format <png|svg>   Output format (default: png)
  --size <number>      Width in pixels (default: 400)
  --help               Show this help message
`);
}

async function main() {
  const { values, positionals } = parseArgs({
    options: {
      general: { type: 'boolean', default: false },
      adventure: { type: 'boolean', default: false },
      url: { type: 'string' },
      output: { type: 'string' },
      format: { type: 'string', default: 'png' },
      size: { type: 'string', default: '400' },
      help: { type: 'boolean', default: false },
    },
    allowPositionals: true,
    strict: false,
  });

  if (values.help || (!values.general && !values.adventure && !values.url)) {
    printUsage();
    return;
  }

  const format = values.format;
  const width = parseInt(values.size, 10);

  if (values.general) {
    await generateGeneral(format);
    return;
  }

  if (values.adventure) {
    const [box, id] = positionals;
    if (!box || !id) {
      console.error('Error: --adventure requires <box> and <id> positional args.');
      console.error('Example: node scripts/generate-qr.js --adventure original 3');
      process.exit(1);
    }
    console.log(`Generating adventure QR: box="${box}", adventure="${id}"...`);
    await generateAdventure(box, id, format);
    return;
  }

  if (values.url) {
    if (!values.output) {
      console.error('Error: --url requires --output <path>.');
      process.exit(1);
    }
    console.log('Generating custom QR code...');
    await generateQR(values.url, values.output, { width });
    return;
  }
}

main().catch((err) => {
  console.error('QR generation failed:', err.message);
  process.exit(1);
});
