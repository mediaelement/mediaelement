
/*
Utility methods
*/
mejs.Utility = {
	encodeUrl: function(url) {
		return encodeURIComponent(url); //.replace(/\?/gi,'%3F').replace(/=/gi,'%3D').replace(/&/gi,'%26');
	},
	escapeHTML: function(s) {
		return s.toString().split('&').join('&amp;').split('<').join('&lt;').split('"').join('&quot;');
	},
	absolutizeUrl: function(url) {
		var el = document.createElement('div');
		el.innerHTML = '<a href="' + this.escapeHTML(url) + '">x</a>';
		return el.firstChild.href;
	},
	getScriptPath: function(scriptNames) {
		var
			i = 0,
			j,
			path = '',
			name = '',
			script,
			scripts = document.getElementsByTagName('script');

		for (; i < scripts.length; i++) {
			script = scripts[i].src;
			for (j = 0; j < scriptNames.length; j++) {
				name = scriptNames[j];
				if (script.indexOf(name) > -1) {
					path = script.substring(0, script.indexOf(name));
					break;
				}
			}
			if (path !== '') {
				break;
			}
		}
		return path;
	},
	secondsToTimeCode: function(seconds,forceHours) {
		seconds = Math.round(seconds);
		var hours,
		    minutes = Math.floor(seconds / 60);
		if (minutes >= 60) {
		    hours = Math.floor(minutes / 60);
		    minutes = minutes % 60;
		}
		hours = hours === undefined ? "00" : (hours >= 10) ? hours : "0" + hours;
		minutes = (minutes >= 10) ? minutes : "0" + minutes;
		seconds = Math.floor(seconds % 60);
		seconds = (seconds >= 10) ? seconds : "0" + seconds;
		return ((hours > 0 || forceHours === true) ? hours + ":" :'') + minutes + ":" + seconds;
	},
	timeCodeToSeconds: function(timecode){
		var tab = timecode.split(':');
		return tab[0]*60*60 + tab[1]*60 + parseFloat(tab[2].replace(',','.'));
	}
};
