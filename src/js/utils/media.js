'use strict';

import mejs from '../core/mejs';
import {escapeHTML} from './general';

export let typeChecks = [];

/**
 *
 * @param {String} url
 * @return {String}
 */
export function absolutizeUrl (url) {

	if (typeof url !== 'string') {
		throw new Error('`url` argument must be a string');
	}

	const el = document.createElement('div');
	el.innerHTML = `<a href="${escapeHTML(url)}">x</a>`;
	return el.firstChild.href;
}

/**
 * Get the format of a specific media, based on URL and additionally its mime type
 *
 * @param {String} url
 * @param {String} type
 * @return {String}
 */
export function formatType (url, type = '') {
	return (url && !type) ? getTypeFromFile(url) : type;
}

/**
 * Return the mime part of the type in case the attribute contains the codec
 * (`video/mp4; codecs="avc1.42E01E, mp4a.40.2"` becomes `video/mp4`)
 *
 * @see http://www.whatwg.org/specs/web-apps/current-work/multipage/video.html#the-source-element
 * @param {String} type
 * @return {String}
 */
export function getMimeFromType (type) {

	if (typeof type !== 'string') {
		throw new Error('`type` argument must be a string');
	}

	return (type && type.indexOf(';') > -1) ? type.substr(0, type.indexOf(';')) : type;
}

/**
 * Get the type of media based on URL structure
 *
 * @param {String} url
 * @return {String}
 */
export function getTypeFromFile (url) {

	if (typeof url !== 'string') {
		throw new Error('`url` argument must be a string');
	}

	for (let i = 0, total = typeChecks.length; i < total; i++) {
		const type = typeChecks[i](url);

		if (type) {
			return type;
		}
	}

	const
		ext = getExtension(url),
		normalizedExt = normalizeExtension(ext)
	;

	let mime = 'video/mp4';

	// Obtain correct MIME types
	if (normalizedExt) {
		if (~['mp4', 'm4v', 'ogg', 'ogv', 'webm', 'flv', 'mpeg'].indexOf(normalizedExt)) {
			mime = `video/${normalizedExt}`;
		} else if ('mov' === normalizedExt) {
			mime = 'video/quicktime';
		} else if (~['mp3', 'oga', 'wav', 'mid', 'midi'].indexOf(normalizedExt)) {
			mime = `audio/${normalizedExt}`;
		}
	}

	return mime;
}

/**
 * Get media file extension from URL
 *
 * @param {String} url
 * @return {String}
 */
export function getExtension (url) {

	if (typeof url !== 'string') {
		throw new Error('`url` argument must be a string');
	}

	const baseUrl = url.split('?')[0], baseName = baseUrl.split('\\').pop().split('/').pop();
	return ~baseName.indexOf('.') ? baseName.substring(baseName.lastIndexOf('.') + 1) : '';
}

/**
 * Get standard extension of a media file
 *
 * @param {String} extension
 * @return {String}
 */
export function normalizeExtension (extension) {

	if (typeof extension !== 'string') {
		throw new Error('`extension` argument must be a string');
	}

	switch (extension) {
		case 'mp4':
		case 'm4v':
			return 'mp4';
		case 'webm':
		case 'webma':
		case 'webmv':
			return 'webm';
		case 'ogg':
		case 'oga':
		case 'ogv':
			return 'ogg';
		default:
			return extension;
	}
}

mejs.Utils = mejs.Utils || {};
mejs.Utils.typeChecks = typeChecks;
mejs.Utils.absolutizeUrl = absolutizeUrl;
mejs.Utils.formatType = formatType;
mejs.Utils.getMimeFromType = getMimeFromType;
mejs.Utils.getTypeFromFile = getTypeFromFile;
mejs.Utils.getExtension = getExtension;
mejs.Utils.normalizeExtension = normalizeExtension;