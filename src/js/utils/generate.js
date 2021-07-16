'use strict';

import mejs from '../core/mejs';

/**
 * Generate HTML for control button with inline SVG inside
 *
 * @param {String} ariaControls id for aria-controls attribute
 * @param {String} ariaLabel text for aria-label attribute
 * @param {String} title text for title attribute
 * @param {String} icon absolute path for the svg icon
 * @param {String} [buttonClass=null] name for css class
 * @return {String}
 */
export function generateControlButton (ariaControls, ariaLabel, title, icon, buttonClass = null) {

	if (typeof ariaControls !== 'string') {
		throw new Error('`ariaControls` argument must be a string');
	}
	if (typeof ariaLabel !== 'string') {
		throw new Error('`ariaLabel` argument must be a string');
	}
	if (typeof title !== 'string') {
		throw new Error('`title` argument must be a string');
	}
	if (typeof icon !== 'string') {
		throw new Error('`icon` argument must be a string');
	}

	const className = buttonClass ? `class=${buttonClass} ` : '';

	return `<button ${className} aria-controls="${ariaControls}" title="${title}" aria-label="${ariaLabel}">
			<svg xmlns="http://www.w3.org/2000/svg" aria-hidden="true" focusable="false">
				<use xlink:href="${icon}"></use>
			</svg>
		</button>`;

}

mejs.Utils = mejs.Utils || {};
mejs.Utils.generateControlButton = generateControlButton;
