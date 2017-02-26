'use strict';

import {renderer} from '../../src/js/core/renderer';
import {expect} from 'chai';

describe('Renderers', () => {

	let renderers,
		mockRenderer = {
			name: 'mock',
			options: {
				prefix: 'mock'
			},
			canPlayType: (type) => {
				let validMedia = ['video/mime-3'];
				return validMedia.indexOf(type) > -1;
			}
		};

	describe('#order', () => {

		it('returns the order', () => {
			expect(renderer.order).to.deep.equal([]);
		});

		it('can be changed', () => {
			renderer.order = ['html5', 'flash_hls', 'flash_video', 'native_hls'];
			expect(renderer.order).to.deep.equal(['html5', 'flash_hls', 'flash_video', 'native_hls']);
		});

		it('only accepts an array of strings', () => {
			let a = () => {
				renderer.order = 'foo';
			};
			expect(a).to.throw(Error);
		});
	});

	describe('#renderers', () => {

		it('returns the renderers', () => {
			expect(renderer.renderers).to.deep.equal({});
		});

		it('can be changed', () => {
			renderer.renderers = mockRenderer;
			expect(renderer.renderers).to.deep.equal(mockRenderer);
		});

		it('only accepts an array of objects', () => {
			let a = () => {
				renderer.renderers = 'foo';
			};
			expect(a).to.throw(Error);

			let b = () => {
				renderer.renderers = mockRenderer;
			};

			expect(b).to.not.throw(Error);
		});
	});

	describe('#add', () => {

		it('can add a renderer as an object with at least `name` property', () => {

			// Proper structure of renderer
			const a = () => {
				renderer.add(mockRenderer);
			};
			expect(a).to.not.throw(Error);

		});

		it('cannot add a renderer as an object without at least `name` property', () => {

			// Incorrect structure
			const b = () => {
				renderer.add({});
			};
			expect(b).to.throw(Error);

		});

	});

	describe('#select', () => {

		const mediaFiles = [
			{type: 'video/mime-1', src: '/path/to/media/1'},
			{type: 'video/mime-2', src: '/path/to/media/2'},
			{type: 'video/mime-3', src: '/path/to/media/3'},
		];

		beforeEach(() => {
			// renderers = new Renderer();
			renderer.add(mockRenderer);
		});

		it('selects a renderer based on media files', () => {

			const a = renderer.select(mediaFiles);
			expect(a).to.deep.equal({rendererName: 'mock', src: '/path/to/media/3'});
		});

		it('selects a renderer based on media files from argument `renderers`', () => {

			const a = renderer.select(mediaFiles, ['mock', 'dummy']);
			expect(a).to.deep.equal({rendererName: 'mock', src: '/path/to/media/3'});

		});

		it('returns null if no renderer was selected', () => {

			const b = renderer.select([{type: 'video/mime-4', src: '/path/to/media/4'}]);
			expect(b === null).to.be.true;

		});

		it('returns null if no renderer was selected from argument `renderers`', () => {

			const a = renderer.select(mediaFiles, ['dummy']);
			expect(a === null).to.be.true;

		});

	});

});
