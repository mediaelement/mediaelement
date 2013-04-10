// check for missing media files and warn to download

$(function() {

	$.ajax({
		url: '../media/echo-hereweare.webm',
		success: function() {},
		error: function(e) {
			$(document.body).prepend($('<div style="margin: 20px; padding: 10px; color: #fff; background: #ff4444; font-family: Helvetica, sanserif;">This demo will not function properly without media files (MP4, WebM, and MP3).<br><br>Please download sample media files from <a style="color:#fff;font-weight:bold" href="https://github.com/johndyer/mediaelement-files/">https://github.com/johndyer/mediaelement-files/</a>.</div>'));
		}
	});

});