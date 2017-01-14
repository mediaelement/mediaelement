// 'use strict';
//
// import document from 'global/document';
// import {expect} from 'chai';
// import MediaElement from '../../src/js/core/mediaelement';
//
// describe('MediaElement', () => {
//
// 	let player;
//
// 	it('starts', () => {
//
// 		document.body.innerHTML = '<div class="media-wrapper">' +
// 			'<video id="player1" width="640" height="360" style="max-width:100%;" preload="none">' +
// 				'<source src="http://clips.vorwaerts-gmbh.de/big_buck_bunny.mp4" type="video/mp4">' +
// 				'<track srclang="en" kind="subtitles" src="../../demo/mediaelement.vtt">' +
// 			'</video>' +
// 		'</div>';
//
// 		player = new MediaElement(document.body.getElementById('player1'));
// 		console.log(player.media.originalNode);
//
// 	});

	// while ((match = /<script src="(.+)">/gim.exec(html)) !== null) {
	// 	matches.push(match[1]);
	// }
	//
	// let scripts = matches.map((scriptSrc) => {
	// 	if (scriptSrc.startsWith('build')) {
	// 		return fs.readFileSync(__dirname + '/../../build/' + scriptSrc, 'utf8');
	// 	} else {
	// 		return fs.readFileSync(__dirname + '/../../demo/' + scriptSrc, 'utf8');
	// 	}
	// });
	//
	// it ('starts', () => {
	// 	jsdom.env({
	// 		html: html,
	// 		src: scripts,
	// 		done: function (error, window) {
	// 			var $ = window.$;
	// 			console.log(error);
	// 			console.log("there have been", $("video").length, " video tags");
	// 			window.close();
	// 			done();
	// 		}
	// 	});
	// });
// });