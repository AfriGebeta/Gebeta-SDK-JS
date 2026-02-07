# Gebeta Maps Assets

This package contains static assets (icons, images) used by Gebeta Maps SDKs.

## Structure

- `icons/maneuvers/` - Navigation maneuver icons (SVG format)
  - `manifest.json` - Icon mapping configuration

## Icon URLs

Icons are served from: `https://assets.gebeta.app/icons/maneuvers/{icon-name}.svg`

## Adding New Icons

1. Add the SVG file to `icons/maneuvers/`
2. Update `icons/maneuvers/manifest.json` with the new icon mapping
3. Deploy assets to CDN
