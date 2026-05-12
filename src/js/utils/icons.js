'use strict';

/**
 * Cache to avoid fetching the same sprite URL multiple times.
 * Maps sprite URL → Set of symbol IDs found in that sprite.
 * @type {Map<string, Set<string>>}
 */
const spriteCache = new Map();

/**
 * Checks whether a `<symbol>` with the given ID exists in an SVG sprite file.
 *
 * Why: `<use xlink:href="external.svg#id">` renders as an empty element when the
 * referenced symbol is absent — there is no synchronous DOM API to detect this.
 * Fetching the sprite (which the browser has already cached from the `<use>` elements)
 * and parsing it lets us detect missing symbols and apply a CSS fallback.
 *
 * @param {string} spriteUrl - URL of the SVG sprite file
 * @param {string} symbolId  - ID of the symbol to look for (without leading `#`)
 * @returns {Promise<boolean>} Resolves to `true` if the symbol exists, `false` otherwise
 */
export function checkSpriteSymbol (spriteUrl, symbolId) {
  if (spriteCache.has(spriteUrl)) {
    return Promise.resolve(spriteCache.get(spriteUrl).has(symbolId));
  }

  return fetch(spriteUrl)
    .then(r => r.text())
    .then(text => {
      const doc = new DOMParser().parseFromString(text, 'image/svg+xml');
      const ids = new Set([...doc.querySelectorAll('symbol')].map(s => s.id));
      spriteCache.set(spriteUrl, ids);
      return ids.has(symbolId);
    })
    .catch(() => false); // on fetch error, assume symbol is missing → apply fallback
}