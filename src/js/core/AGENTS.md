# src/js/core

Core engine of MediaElementJS. Four files; no barrel export.

## FILES

| File | Exports | Role |
|------|---------|------|
| `mejs.js` | `default mejs` | Global namespace (`window.mejs`); version, `html5media` spec object |
| `mediaelement.js` | `default MediaElement` | Core class: creates fake DOM node, resolves renderer, proxies HTML5 media API |
| `renderer.js` | `named renderer` | Singleton registry + selector; renderers ranked native-first, iframe-second |
| `i18n.js` | `default i18n` | Locale manager: `.language(code, strings)` setter, `.t(key, pluralN?)` translator |

## WHERE TO LOOK

- Add/change HTML5 media property proxying → `mediaelement.js` (`mejs.html5media.properties` loop)
- Change renderer selection logic → `renderer.js` `select()` method
- Add new language or change plural logic → `i18n.js` + `src/js/languages/`
- Access the global version → `mejs.version` in `mejs.js`

## CONVENTIONS

- `const t = this` alias pattern used throughout `mediaelement.js`
- `renderer.add(rendererObject)` — object must have `name`, `canPlayType`, `create`
- `i18n` key format: `'mejs.[element-id]'` (e.g. `'mejs.play'`)
- Plural-form number is family group, not count — see comments in `i18n.js`

## ANTI-PATTERNS

- Do not import from `global/window` or `global/document` directly in feature/renderer files without going through utils — use `src/js/utils/constants.js` for UA detection
- `mejs.html5media.readOnlyProperties` must stay in sync with `properties` list — do not add setters for read-only props