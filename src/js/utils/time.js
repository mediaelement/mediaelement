'use strict';

import mejs from '../core/mejs';

/**
 * Format a numeric time in format '00:00:00'
 *
 * @param {Number} time - Ideally a number, but if not or less than zero, is defaulted to zero
 * @param {Boolean} forceHours
 * @param {Boolean} showFrameCount
 * @param {Number} fps - Frames per second
 * @return {String}
 */
export function secondsToTimeCode (time, forceHours = false, showFrameCount = false, fps = 25) {

	time = !time || typeof time !== 'number' || time < 0 ? 0 : time;

	let hours = Math.floor(time / 3600) % 24;
	let minutes = Math.floor(time / 60) % 60;
	let seconds = Math.floor(time % 60);
	let frames = Math.floor(((time % 1) * fps).toFixed(3));

	hours = hours <= 0 ? 0 : hours;
	minutes = minutes <= 0 ? 0 : minutes;
	seconds = seconds <= 0 ? 0 : seconds;

	let result = (forceHours || hours > 0) ? `${(hours < 10 ? `0${hours}` : hours)}:` : '';
	result += `${(minutes < 10 ? `0${minutes}` : minutes)}:`;
	result += `${(seconds < 10 ? `0${seconds}` : seconds)}`;
	result += `${((showFrameCount) ? `:${(frames < 10 ? `0${frames}` : frames)}` : '')}`;

	return result;
}

/**
 * Convert a '00:00:00' time string into seconds
 *
 * @param {String} time
 * @param {Boolean} showFrameCount
 * @param {Number} fps - Frames per second
 * @return {Number}
 */
export function timeCodeToSeconds (time, showFrameCount = false, fps = 25) {

	if (typeof time !== 'string') {
		throw new TypeError('Time must be a string');
	}

	if (!time.match(/\d{2}(\:\d{2}){0,3}/)) {
		throw new TypeError('Time code must have the format `00:00:00`');
	}

	let
		parts = time.split(':'),
		hours = 0,
		minutes = 0,
		frames = 0,
		seconds = 0,
		output
		;

	switch (parts.length) {
		default:
		case 1:
			seconds = parseInt(parts[0], 10);
			break;
		case 2:
			minutes = parseInt(parts[0], 10);
			seconds = parseInt(parts[1], 10);
			break;
		case 3:
		case 4:
			hours = parseInt(parts[0], 10);
			minutes = parseInt(parts[1], 10);
			seconds = parseInt(parts[2], 10);
			frames = showFrameCount ? parseInt(parts[3]) / fps : 0;
			break;

	}

	output = ( hours * 3600 ) + ( minutes * 60 ) + seconds + frames;
	return parseFloat((output).toFixed(3));
}

/**
 * Calculate the time format to use
 *
 * There is a default format set in the options but it can be incomplete, so it is adjusted according to the media
 * duration. Format: 'hh:mm:ss:ff'
 * @param {*} time - Ideally a number, but if not or less than zero, is defaulted to zero
 * @param {Object} options
 * @param {Number} fps - Frames per second
 */
export function calculateTimeFormat (time, options, fps = 25) {

	time = !time || typeof time !== 'number' || time < 0 ? 0 : time;

	let
		required = false,
		format = options.timeFormat,
		firstChar = format[0],
		firstTwoPlaces = (format[1] === format[0]),
		separatorIndex = firstTwoPlaces ? 2 : 1,
		separator = format.length < separatorIndex ? format[separatorIndex] : ':',
		hours = Math.floor(time / 3600) % 24,
		minutes = Math.floor(time / 60) % 60,
		seconds = Math.floor(time % 60),
		frames = Math.floor(((time % 1) * fps).toFixed(3)),
		lis = [
			[frames, 'f'],
			[seconds, 's'],
			[minutes, 'm'],
			[hours, 'h']
		]
		;

	for (let i = 0, len = lis.length; i < len; i++) {
		if (format.indexOf(lis[i][1]) > -1) {
			required = true;
		}
		else if (required) {
			let hasNextValue = false;
			for (let j = i; j < len; j++) {
				if (lis[j][0] > 0) {
					hasNextValue = true;
					break;
				}
			}

			if (!hasNextValue) {
				break;
			}

			if (!firstTwoPlaces) {
				format = firstChar + format;
			}
			format = lis[i][1] + separator + format;
			if (firstTwoPlaces) {
				format = lis[i][1] + format;
			}
			firstChar = lis[i][1];
		}
	}

	options.currentTimeFormat = format;
}

/**
 * Convert Society of Motion Picture and Television Engineers (SMTPE) time code into seconds
 *
 * @param {String} SMPTE
 * @return {Number}
 */
export function convertSMPTEtoSeconds (SMPTE) {

	if (typeof SMPTE !== 'string') {
		throw new TypeError('Argument must be a string value');
	}

	SMPTE = SMPTE.replace(',', '.');

	let
		secs = 0,
		decimalLen = (SMPTE.indexOf('.') > -1) ? SMPTE.split('.')[1].length : 0,
		multiplier = 1
		;

	SMPTE = SMPTE.split(':').reverse();

	for (let i = 0; i < SMPTE.length; i++) {
		multiplier = 1;
		if (i > 0) {
			multiplier = Math.pow(60, i);
		}
		secs += Number(SMPTE[i]) * multiplier;
	}
	return Number(secs.toFixed(decimalLen));
}

mejs.Utils = mejs.Utils || {};
mejs.Utils.secondsToTimeCode = secondsToTimeCode;
mejs.Utils.timeCodeToSeconds = timeCodeToSeconds;
mejs.Utils.calculateTimeFormat = calculateTimeFormat;
mejs.Utils.convertSMPTEtoSeconds = convertSMPTEtoSeconds;