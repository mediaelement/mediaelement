'use strict';

import mejs from './mejs';

/**
 *
 * Class to manage renderer selection and addition.
 * @class Renderer
 */
class Renderer {

	constructor () {
		this.renderers = {};
		this.order = [];
	}

	/**
	 * Register a new renderer.
	 *
	 * @param {Object} renderer - An object with all the rendered information (name REQUIRED)
	 * @method add
	 */
	add (renderer) {

		if (renderer.name === undefined) {
			throw new TypeError('renderer must contain at least `name` property');
		}

		this.renderers[renderer.name] = renderer;
		this.order.push(renderer.name);
	}

	/**
	 * Iterate a list of renderers to determine which one should the player use.
	 *
	 * @param {Object[]} mediaFiles - A list of source and type obtained from video/audio/source tags: [{src:'',type:''}]
	 * @param {?String[]} renderers - Optional list of pre-selected renderers
	 * @return {?Object} The renderer's name and source selected
	 * @method select
	 */
	select (mediaFiles, renderers = []) {

		renderers = renderers.length ? renderers: this.order;

		for (let i = 0, il = renderers.length; i < il; i++) {
			let
				key = renderers[i],
				renderer = this.renderers[key]
			;

			if (renderer !== null && renderer !== undefined) {
				for (let j = 0, jl = mediaFiles.length; j < jl; j++) {
					if (typeof renderer.canPlayType === 'function' && typeof mediaFiles[j].type === 'string' &&
						renderer.canPlayType(mediaFiles[j].type)) {
						return {
							rendererName: renderer.name,
							src:  mediaFiles[j].src
						};
					}
				}
			}
		}

		return null;
	}

	// Setters/getters

	set order(order) {

		if (!Array.isArray(order)) {
			throw new TypeError('order must be an array of strings.');
		}

		this._order = order;
	}

	set renderers(renderers) {

		if (renderers !== null && typeof renderers !== 'object') {
			throw new TypeError('renderers must be an array of objects.');
		}

		this._renderers = renderers;
	}

	get renderers() {
		return this._renderers;
	}

	get order() {
		return this._order;
	}
}

export let renderer = new Renderer();

mejs.Renderers = renderer;