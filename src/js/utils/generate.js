'use strict';

import mejs from '../core/mejs';

/**
 *
 * @param {String} ariaControls
 * @param {String} ariaLabel
 * @param {String} title
 * @param {String} icon
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

	const button =
		`<button ${className} type="button" aria-controls="${ariaControls}" title="${title}" aria-label="${ariaLabel}" tabindex="0">
			<svg xmlns="http://www.w3.org/2000/svg" aria-hidden="true" focusable="false">
				<use xlink:href="${icon}"></use>
			</svg>
		</button>`;

	return button;
}

mejs.Utils = mejs.Utils || {};
mejs.Utils.generateControlButton = generateControlButton;
