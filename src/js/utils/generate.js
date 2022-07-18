'use strict';

import mejs from '../core/mejs';

/**
 * Generate HTML for control button with inline SVG inside
 *
 * @param {String} playerId id for player
 * @param {String} ariaLabel text for aria-label attribute
 * @param {String} title text for title attribute
 * @param {String} iconSprite absolute path for the svg icon sprite
 * @param {Array} icons array of svg icons
 * @param {String} classPrefix prefix for css class
 * @param {String} [buttonClass=null] name for css class for button
 * @param {String} ariaDescribedby id for aria-describedby attribute
 * @return {String}
 */
export function generateControlButton (playerId, ariaLabel, title, iconSprite, icons, classPrefix, buttonClass = null, ariaDescribedby= '', ariaPressed = null) {

	if (typeof playerId !== 'string') {
		throw new Error('`ariaControls` argument must be a string');
	}
	if (typeof ariaLabel !== 'string') {
		throw new Error('`ariaLabel` argument must be a string');
	}
	if (typeof title !== 'string') {
		throw new Error('`title` argument must be a string');
	}
	if (typeof iconSprite !== 'string') {
		throw new Error('`iconSprite` argument must be a string');
	}
	if (typeof ariaDescribedby !== 'string') {
		throw new Error('`ariaDescribedby` argument must be a string');
	}
	if (!Array.isArray(icons)) {
		throw new Error('`icons` argument must be an array');
	}
	if (typeof classPrefix !== 'string') {
		throw new Error('`classPrefix` argument must be a string');
	}

	const className = buttonClass ? `class="${buttonClass}" ` : '';

	const ariaDescribedbyAttr = ariaDescribedby !== '' ? `aria-describedby="${ariaDescribedby}" ` : '';

	const ariaPressedAttr = ariaPressed !== null ?  `aria-pressed="${ariaPressed}"` : '';

	const iconHtml = icons.map(icon => {
		return `<svg xmlns="http://www.w3.org/2000/svg" id="${playerId}-${icon}" class="${classPrefix}${icon}" aria-hidden="true" focusable="false">
				<use xlink:href="${iconSprite}#${icon}"></use>
			</svg>
`	})

	return `<button ${className} type="button" aria-controls="${playerId}" title="${title}" aria-label="${ariaLabel}" ${ariaDescribedbyAttr} ${ariaPressedAttr}>
			${iconHtml.join('')}
		</button>`;
}

mejs.Utils = mejs.Utils || {};
mejs.Utils.generateControlButton = generateControlButton;
