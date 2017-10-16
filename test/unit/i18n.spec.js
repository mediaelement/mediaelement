'use strict';

import i18n from '../../src/js/core/i18n';
import {expect} from 'chai';

describe('i18n', () => {

	// cache original language
	const english = i18n.en;

	beforeEach(() => {
		i18n.language('en', english);
	});

	describe('#language', () => {

		it('return the default language (English)', () => {
			expect(i18n.language()).to.equal('en');
		});

		it('can override the default language strings with new ones', () => {

			i18n.language('en', {'a': 'This is a test'});
			expect(i18n.lang).to.equal('en');
			expect(i18n.en).to.deep.equal({'a': 'This is a test'});
		});

		it ('assign any language and its translations', () => {
			i18n.language('tt');
			expect(i18n.tt).to.deep.equal(english);
		});

		it ('assign default language (English) if not translations found for specified language', () => {
			i18n.language('tt', {'a': 'This is a test'});
			expect(i18n.tt).to.deep.equal({'a': 'This is a test'});
		});

		it('check if language code passed is valid', () => {

			expect(() => {
				i18n.language(12345);
			}).to.throw(TypeError);

			expect(() => {
				i18n.language('xxxx');
			}).to.throw(TypeError);

			expect(() => {
				i18n.language('x', {});
			}).to.throw(TypeError);

			expect(() => {
				i18n.language('xxx', {});
			}).not.to.throw(TypeError);

			expect(() => {
				i18n.language('xx-xx', {});
			}).not.to.throw(TypeError);

			expect(() => {
				i18n.language('xxx_XX', {});
			}).not.to.throw(TypeError);
		});
	});

	describe('#t', () => {

		it('check if language exists; otherwise, it will print the string escaping HTML', () => {
			i18n.language('xx', {});
			expect(i18n.t('<p>Hello, "world" & everybody</p>')).to.equal('&lt;p&gt;Hello, &quot;world&quot; &amp; everybody&lt;/p&gt;');
			expect(i18n.t(246437)).to.equal(246437);
		});

		it('translate strings or returns the specified value, replacing %1 by a specified number', () => {
			expect(i18n.t('This is test #%1', 53)).to.equal('This is test #53');
		});

		it('translate to a specific language', () => {

			i18n.language('ko', {
				"mejs.plural-form": 0,
				'mejs.play': '작동'
			});
			expect(i18n.t('mejs.play')).to.equal('작동');

			i18n.language('es', {
				"mejs.plural-form": 1,
				'mejs.play': 'Reproducción'
			});
			expect(i18n.t('mejs.play')).to.equal('Reproducción');

		});

		it('pluralize a string properly in different languages', () => {

			i18n.language('ko', {
				"mejs.plural-form": 0,
				'mejs.time-skip-back': '%1초 를 뒤로 건너뛰세요'
			});
			expect(i18n.t('mejs.time-skip-back', 1)).to.equal('1초 를 뒤로 건너뛰세요');
			expect(i18n.t('mejs.time-skip-back', 30)).to.equal('30초 를 뒤로 건너뛰세요');

			i18n.language('es', {
				"mejs.plural-form": 1,
				'mejs.time-jump-forward': ['Adelantar 1 segundo', 'Adelantar %1 segundos'],
				'mejs.fullscreen-off': 'Desconectar pantalla completa'
			});
			expect(i18n.t('mejs.time-jump-forward', 1)).to.equal('Adelantar 1 segundo');
			expect(i18n.t('mejs.time-jump-forward', 30)).to.equal('Adelantar 30 segundos');
			expect(i18n.t('mejs.fullscreen-off', 400)).to.equal('Desconectar pantalla completa');
			expect(i18n.t('Hola', 400)).to.equal('Hola');


			i18n.language('ar', {});
			expect(i18n.t('This is a test', 1)).to.equal('This is a test');
			expect(i18n.t('This is test #%1', 1)).to.equal('This is test #1');
			expect(i18n.t('This is test #%1', 30)).to.equal('This is test #30');


			i18n.language('tt', {'a': 'This is a test'});
			expect(i18n.t('a')).to.equal('This is a test');
			expect(i18n.t('This is a test', 1)).to.equal('This is a test');
			expect(i18n.t('This is test #%1', 30)).to.equal('This is test #30');
		});
	});
});