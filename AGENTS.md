# PROJECT KNOWLEDGE BASE

## OVERVIEW

MediaElementJS — HTML5 `<audio>`/`<video>` player library with renderer abstraction (HTML5, HLS, DASH, YouTube, Vimeo, etc.) and a jQuery-compatible player UI. Pure ES6/JavaScript (no TypeScript), built with Grunt + Browserify targeting IE11+/iOS8+/Android 4+.

## STRUCTURE

```
mediaelement/
├── src/js/           # All editable source (NEVER touch build/)
│   ├── core/         # MediaElement engine, renderer registry, i18n, mejs namespace [more information](/src/js/core/AGENTS.md)
│   ├── features/     # Player UI controls (buttons, progress bar, etc.)
│   ├── renderers/    # Media format backends (html5, hls, dash, youtube, vimeo…)
│   ├── utils/        # Shared DOM, constants, generate, media, time, polyfill
│   ├── player/       # jQuery plugin wrapper + DefaultPlayer sub-modules
│   ├── languages/    # i18n translation files (26+ locales)
│   ├── player.js     # MediaElementPlayer class (~2000 lines, main UI orchestrator)
│   └── header.js     # License banner prepended to every built file
├── src/css/          # CSS source + mejs-controls.svg sprite
├── build/            # ⛔ Generated artifacts — DO NOT EDIT
├── test/unit/        # Mocha unit tests (*.spec.js)
├── test/player.html  # Browser-based integration test runner
├── demo/             # Demo pages for manual testing
├── docs/             # Contributor guidelines, API docs, migration guide
├── full.js           # npm entry point → build/mediaelement-and-player.js (full bundle)
├── full.js           # npm entry point → build/mediaelement-and-player.js (full bundle)
├── standalone.js     # Alt entry → build/mediaelement.js (core only, no UI)
├── Gruntfile.js      # Build pipeline definition
└── RELEASE.md        # Manual release checklist
```

## WHERE TO LOOK

| Task | Location | Notes |
|------|----------|-------|
| Core MediaElement API | `src/js/core/mediaelement.js` | Class-based, ES6 |
| Renderer abstraction | `src/js/core/renderer.js` | `renderer.add()` / `renderer.select()` |
| Player config defaults | `src/js/player.js` top — `export const config` | Features augment this via `Object.assign(config, …)` |
| Adding a new control feature | `src/js/features/` | Must use `build[featureName]` method on `MediaElementPlayer.prototype` |
| Adding a renderer | `src/js/renderers/` | Follow template in `docs/guidelines.md` |
| i18n strings | `src/js/core/i18n.js` + `src/js/languages/` | Key format: `'mejs.[id]'` |
| SVG icon sprite | `src/css/mejs-controls.svg` | Symbols referenced via `<use xlink:href="…#icon-name">` |
| Build pipeline | `Gruntfile.js` | Browserify bundle composition manually defined here |
| Release process | `RELEASE.md` | 10-step manual process; version updated in 4 files |
| Release process | `RELEASE.md` | 10-step manual process; version updated in 4 files |
| Test execution | `npm test` | Mocha + Istanbul + Babel; tests in `test/unit/` |

## CODE MAP

| Symbol | Type | Location | Role |
|--------|------|----------|------|
| `MediaElement` | class | `src/js/core/mediaelement.js` | Core element wrapper; creates fake node, delegates to renderer |
| `Renderer` | class | `src/js/core/renderer.js` | Registry + selector; `renderer.add()` / `renderer.select()` |
| `mejs` | namespace | `src/js/core/mejs.js` | `window.mejs`; holds version, html5media spec, players map |
| `MediaElementPlayer` | class | `src/js/player.js` | Main UI class; features attach via `Object.assign(…prototype, …)` |
| `config` | export | `src/js/player.js` | Shared config object; features extend it with `Object.assign(config, …)` |
| `generateControlButton` | fn | `src/js/utils/generate.js` | Creates button HTML with inline SVG `<use>` per icon array |
| `i18n` | object | `src/js/core/i18n.js` | `.language(code, strings)` setter, `.t(key, plural?)` translator |

## CONVENTIONS

- **Tab size: 8** (not 4) for JS indentation
- **CSS properties: alphabetical order** (stylelint enforced)
- **Edit `/src/` ONLY** — `build/` is generated output, never commit edits there
- Features extend `MediaElementPlayer.prototype` and `config` directly via `Object.assign` — no class inheritance
- Feature build method naming: `build[featureName](player, controls, layers, media)` — exact prefix required
- Renderer naming: `name` property must be unique string; file ~= `src/js/renderers/[name].js`
- Avoid `for…of` loops in renderers — breaks bundle size optimization
- JSDoc on all public functions/classes (document *why*, not *what*)
- CSS single quotes, 4-space indent, no trailing zeros, `#abc` not `#aabbcc`

## ANTI-PATTERNS (THIS PROJECT)

- **NEVER edit `/build/`** — all changes go in `/src/`
- Never add `.mejs__active` class for toggle state — actual state classes: `.mejs__play`/`.mejs__pause`, `.mejs__mute`/`.mejs__unmute`, `.mejs__fullscreen`/`.mejs__unfullscreen`
- Avoid `for…of` loops in renderers (bundle size regression)
- `no-console` ESLint rule is disabled intentionally — `console.log` calls are stripped by `grunt-remove-logging` in production builds
- `no-undef` is disabled — globals like `jQuery`, `Zepto` are expected from host environment

## ICON / SVG SYSTEM

Icons are SVG symbols in `src/css/mejs-controls.svg`. Each button renders **all icons for that group simultaneously**; CSS visibility is driven by the **container div's state class**:

```css
/* Base: hide all icons */
.mejs__playpause-button svg { display: none; }
/* Show correct icon per state */
.mejs__play svg.mejs__icon-play   { display: block; }
.mejs__pause svg.mejs__icon-pause { display: block; }
```

To add a new icon: (1) add `<symbol id="icon-[name]">` to sprite, (2) add `'icon-[name]'` to the icons array in the relevant feature, (3) add CSS rule using existing state class.

## COMMANDS

```bash
npm run build        # Full production build via grunt
npm run watch        # Watch + rebuild on change
npm test             # Mocha unit tests + Istanbul coverage
grunt --renderers=hls,dash   # Build with specific renderers only
grunt debug          # Build keeping console.log statements
```

## NOTES

- `player.js` is ~2000 lines; the `/src/js/player/` subdirectory holds only jQuery plugin wrapper (`library.js`) and `DefaultPlayer` sub-module — player logic is NOT split across it
- Version must be updated in **4 places** on release: `src/js/core/mejs.js`, `package.js`, `package-lock.json`, `package.json`
- `full.js` (npm `main`) wraps the full player bundle; `standalone.js` wraps core only and uses `.default` accessor (unlike `full.js`)
- Legacy support: IE11+, iOS 8+, Android 4+ — avoid modern JS that Babel can't polyfill
- Travis CI is legacy; no GitHub Actions present
- Travis CI is legacy; no GitHub Actions present