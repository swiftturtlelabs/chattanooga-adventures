---
name: qr-code-generation
description: Generate QR code images for Chattanooga Adventures pages. Use when creating a new adventure, adding a new site page, or when the user asks about QR codes, printing materials, or marketing assets.
---

# QR Code Generation

## When to Generate

- **New adventure added**: Generate a QR code linking to that adventure's reveal page
- **New site page added**: Generate a QR code in `QR_Codes/General/`
- **User requests a QR code**: For any URL

## Folder Structure

```
QR_Codes/
  General/              # Site-wide pages (homepage, support, etc.)
    homepage.png
    support.png
  adventures/           # One subfolder per box, one file per adventure
    original/
      1.png
      2.png
      3.png
    deluxe/
      1.png
```

## Generation Script

The script lives at `scripts/generate-qr.js`. It requires Node.js and the `qrcode` package (listed in `package.json`).

If `node_modules/` does not exist, run `npm install` first.

### Generate a QR for a specific adventure

```powershell
node scripts/generate-qr.js --adventure <box> <id>
```

Example:

```powershell
node scripts/generate-qr.js --adventure original 3
```

Output: `QR_Codes/adventures/original/3.png`

### Generate all general site QR codes

```powershell
node scripts/generate-qr.js --general
```

Output: `QR_Codes/General/homepage.png`, `QR_Codes/General/support.png`, etc.

### Generate a QR for an arbitrary URL

```powershell
node scripts/generate-qr.js --url "https://example.com" --output "QR_Codes/General/custom.png"
```

### SVG output

Append `--format svg` to any command:

```powershell
node scripts/generate-qr.js --adventure original 3 --format svg
```

## Workflow: New Adventure Created

Every time a new adventure is added to the site or to Firestore, follow these steps:

1. Run the generation command for that adventure:

```powershell
node scripts/generate-qr.js --adventure <box> <adventureId>
```

2. Verify the file was created in `QR_Codes/adventures/<box>/<adventureId>.png`
3. Inform the user that the QR code is ready and where to find it

## Workflow: New General Page Created

When a new page is added to the site (not an adventure):

1. Add the page to the `GENERAL_PAGES` array in `scripts/generate-qr.js`
2. Run `node scripts/generate-qr.js --general`
3. Verify the file was created in `QR_Codes/General/`

## Configuration

Defaults in `scripts/generate-qr.js`:

| Setting | Value | Notes |
|---------|-------|-------|
| Base URL | `https://chattanooga-adventures.web.app` | Production site |
| Size | 400px | Good for print at ~1.3 inches |
| Error correction | H (high, 30%) | Tolerates partial damage — best for printed cards |
| Margin | 2 modules | Standard quiet zone |
| Format | PNG | Use `--format svg` for scalable output |

## Notes

- QR codes are excluded from Firebase deploys via `firebase.json` ignore rules
- The `QR_Codes/` folder is committed to the repo so codes are version-controlled
- Adventure URLs follow the pattern: `https://chattanooga-adventures.web.app/adventure?box={box}&adventure={id}`
