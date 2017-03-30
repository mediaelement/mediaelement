'use strict';

import mejs from '../core/mejs';

/**
 * Indicate if FPS is dropFrame (typically non-integer frame rates: 29.976)
 *
 * @param {Number} fps - Frames per second
 * @return {Boolean}
 */
export function isDropFrame(fps = 25) {
	return !(fps % 1 === 0);
}
/**
 * Format a numeric time in format '00:00:00'
 *
 * @param {Number} time - Ideally a number, but if not or less than zero, is defaulted to zero
 * @param {Boolean} forceHours
 * @param {Boolean} showFrameCount
 * @param {Number} fps - Frames per second
 * @param {Number} secondsDecimalLength - Number of decimals to display if any
 * @return {String}
 */
export function secondsToTimeCode(time, forceHours = false, showFrameCount = false, fps = 25, secondsDecimalLength = 0) {

	time = !time || typeof time !== 'number' || time < 0 ? 0 : time;

	let
		dropFrames = Math.round(fps * 0.066666), // Number of drop frames to drop on the minute marks (6%)
		timeBase = Math.round(fps),
		framesPer24Hours = Math.round(fps * 3600) * 24,
		framesPer10Minutes = Math.round(fps * 600),
		frameSep = isDropFrame(fps) ? ';' : ':',
		hours,
		minutes,
		seconds,
		frames,
		f = Math.round(time * fps)
	;

	if (isDropFrame(fps)) {

		if (f < 0) {
			f = framesPer24Hours + f;
		}

		f = f % framesPer24Hours;

		const d = Math.floor(f / framesPer10Minutes);
		const m = f % framesPer10Minutes;
		f = f + dropFrames * 9 * d;
		if (m > dropFrames) {
			f = f + dropFrames * (Math.floor((m - dropFrames) / (Math.round(timeBase * 60 - dropFrames))));
		}

		const timeBaseDivision = Math.floor(f / timeBase);

		hours = Math.floor(Math.floor(timeBaseDivision / 60) / 60);
		minutes = Math.floor(timeBaseDivision / 60) % 60;

		if (showFrameCount) {
			seconds = timeBaseDivision % 60;
		} else {
			seconds = ((f / timeBase) % 60).toFixed(secondsDecimalLength);
		}
	}
	else {
		hours = Math.floor(time / 3600) % 24;
		minutes = Math.floor(time / 60) % 60;
		if (showFrameCount) {
			seconds = Math.floor(time % 60);
		} else {
			seconds = (time % 60).toFixed(secondsDecimalLength);
		}
	}
	hours = hours <= 0 ? 0 : hours;
	minutes = minutes <= 0 ? 0 : minutes;
	seconds = seconds <= 0 ? 0 : seconds;

	let result = (forceHours || hours > 0) ? `${(hours < 10 ? `0${hours}` : hours)}:` : '';
	result += `${(minutes < 10 ? `0${minutes}` : minutes)}:`;
	result += `${(seconds < 10 ? `0${seconds}` : seconds)}`;

	if (showFrameCount) {
		frames = (f % timeBase).toFixed(0);
		frames = frames <= 0 ? 0 : frames;
		result += (frames < 10) ? `${frameSep}0${frames}` : `${frameSep}${frames}`;
	}

	return result;
}

/**
 * Convert a '00:00:00' time string into seconds
 *
 * @param {String} time
 * @param {Number} fps - Frames per second
 * @return {Number}
 */
export function timeCodeToSeconds (time, fps = 25) {

	if (typeof time !== 'string') {
		throw new TypeError('Time must be a string');
	}

	if (time.indexOf(';') > 0) {
		time = time.replace(';', ':');
	}

	if (!time.match(/\d{2}(\:\d{2}){0,3}/)) {
		throw new TypeError('Time code must have the format `00:00:00`');
	}

	const parts = time.split(':');

	let
		output,
		hours = 0,
		minutes = 0,
		seconds = 0,
		frames = 0,
		totalMinutes = 0,
		dropFrames = Math.round(fps * 0.066666), // Number of drop frames to drop on the minute marks (6%)
		timeBase = Math.round(fps),
		hFrames = timeBase * 3600,
		mFrames = timeBase * 60
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
			hours = parseInt(parts[0], 10);
			minutes = parseInt(parts[1], 10);
			seconds = parseInt(parts[2], 10);
			break;
		case 4:
			hours = parseInt(parts[0], 10);
			minutes = parseInt(parts[1], 10);
			seconds = parseInt(parts[2], 10);
			frames = parseInt(parts[3], 10);
			break;
	}

	if (isDropFrame(fps)) {
		totalMinutes = (60 * hours) + minutes;
		output = ((hFrames * hours) + (mFrames * minutes) + (timeBase * seconds) + frames) - (dropFrames * (totalMinutes - (Math.floor(totalMinutes / 10))));
	} else {
		output = (( hFrames * hours ) + ( mFrames * minutes  ) + fps * seconds + frames) / fps;
	}

	return parseFloat(output.toFixed(3));
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

	const
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

	let
		format = options.timeFormat,
		firstTwoPlaces = (format[1] === format[0]),
		separatorIndex = firstTwoPlaces ? 2 : 1,
		separator = format.length < separatorIndex ? format[separatorIndex] : ':',
		firstChar = format[0],
		required = false
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

	const decimalLen = (SMPTE.indexOf('.') > -1) ? SMPTE.split('.')[1].length : 0;

	let
		secs = 0,
		multiplier = 1
	;

	SMPTE = SMPTE.split(':').reverse();

	for (let i = 0, total = SMPTE.length; i < total; i++) {
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
