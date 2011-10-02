
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
	secondsToTimeCode: function(time,forceHours, showFrameCount, fps) {
        //add framecount
        if(showFrameCount==undefined) {
            var showFrameCount=false;
        } else if(fps==undefined) {
            var fps=25;
        }

        var hours = Math.floor(time / 3600) % 24;
        var minutes = Math.floor(time / 60) % 60;
        var seconds = Math.floor(time % 60);
        var frames="";

        if(showFrameCount!=undefined && showFrameCount) {
            frames = Math.floor(((time % 1)*fps).toFixed(3));
        }

        var result = (hours < 10 ? "0" + hours : hours) + ":"
        + (minutes < 10 ? "0" + minutes : minutes) + ":"
        + (seconds < 10 ? "0" + seconds : seconds);

        if(showFrameCount!=undefined && showFrameCount) {
            result = result + ":" + (frames < 10 ? "0" + frames : frames);
        }

        return result;


        /*
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
		*/
	},
	timeCodeToSeconds: function(hh_mm_ss_ff, showFrameCount, fps){
        if(showFrameCount==undefined) {
            var showFrameCount=false;
        } else if(fps==undefined) {
            var fps=25;
        }

        var tc_array = hh_mm_ss_ff.split(":");
        var tc_hh = parseInt(tc_array[0]);
        var tc_mm = parseInt(tc_array[1]);
        var tc_ss = parseInt(tc_array[2]);

        var tc_ff = 0;
        if(showFrameCount!=undefined && showFrameCount) {
            tc_ff = parseInt(tc_array[3])/fps;
        }
        var tc_in_seconds = ( tc_hh * 3600 ) + ( tc_mm * 60 ) + tc_ss + tc_ff;
        return tc_in_seconds;

        /*
		var tab = timecode.split(':');
		return tab[0]*60*60 + tab[1]*60 + parseFloat(tab[2].replace(',','.'));
		*/
	}
};
