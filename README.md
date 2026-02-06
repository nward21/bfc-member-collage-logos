# BFC Logo Grid - Member Logo Asset Manager & Embed Generator

A centralized web asset system for managing and embedding BFC member logos.

**GitHub Pages URL:** `https://nward21.github.io/bfc-member-collage-logos/`

## Quick Start

```bash
# Install dependencies
npm install

# Run the preview dashboard
npm run dev

# Build the embeddable web component
npm run build:component
```

## Project Structure

```
├── members.json           # Member data (logos, tiers, etc.)
├── logos/                 # Logo image files (served via GitHub Pages)
├── src/
│   ├── BfcLogoGrid.jsx    # Core React component
│   ├── App.jsx            # Preview dashboard
│   ├── main.jsx           # Dashboard entry point
│   └── web-component.jsx  # Custom Element wrapper
├── dist/
│   └── component/
│       └── bfc-logo-grid.js  # Built web component
```

## Usage

### Preview Dashboard

Run `npm run dev` to launch the workbench at `http://localhost:3000`. Use it to:
- Toggle between Landscape (16:9) and Square (1:1) layouts
- Switch between Tiered and Alphabetical display modes
- Copy embed codes for any configuration

### Embedding on External Sites

```html
<!-- Load the component script -->
<script src="https://nward21.github.io/bfc-member-collage-logos/bfc-logo-grid.js"></script>

<!-- Use the custom element -->
<bfc-logo-grid
  ratio="landscape"
  mode="tiered"
  data-url="https://nward21.github.io/bfc-member-collage-logos/members.json">
</bfc-logo-grid>
```

### Component Attributes

| Attribute   | Values                      | Default     | Description                          |
|-------------|-----------------------------|-------------|--------------------------------------|
| `ratio`     | `landscape`, `square`       | `landscape` | Aspect ratio (16:9 or 1:1)           |
| `mode`      | `tiered`, `alphabetical`    | `tiered`    | Display mode                         |
| `data-url`  | URL string                  | —           | URL to members.json file             |

**Note:** In alphabetical mode, Founding Members always appear first.

## GitHub Pages Deployment

This repo uses GitHub Pages to serve assets. Files are available at:
- `https://nward21.github.io/bfc-member-collage-logos/bfc-logo-grid.js`
- `https://nward21.github.io/bfc-member-collage-logos/members.json`
- `https://nward21.github.io/bfc-member-collage-logos/logos/[filename].png`

### Initial Setup

1. Enable GitHub Pages in repo Settings → Pages → Source: "Deploy from a branch" → Branch: `main`
2. Build and commit the component:
   ```bash
   npm run build:component
   cp dist/component/bfc-logo-grid.js .
   git add bfc-logo-grid.js
   git commit -m "Add built component"
   git push
   ```

### Updating Members

1. Edit `members.json`
2. Add logo files to `logos/`
3. Commit and push

**All embeds update automatically** since they fetch `members.json` at runtime.

## Member Tiers

| Tier       | Description                     |
|------------|----------------------------------|
| `founding` | Founding Members (Strategy, BTC Inc) |
| `gold`     | Gold tier members               |
| `silver`   | Silver tier members             |
| `general`  | General members                 |

## Adding Logo Images

1. Add logo files to `logos/` folder
2. The `logo_url` in `members.json` should be the full GitHub Pages URL:
   ```json
   {
     "name": "Company Name",
     "logo_url": "https://nward21.github.io/bfc-member-collage-logos/logos/company-name.png",
     "tier": "gold",
     "is_founding": false
   }
   ```

**Tip:** Use transparent PNGs or SVGs. Logos are displayed white-on-black (inverted filter applied).
