(function($) {
	
	$.extend(mejs.MepDefaults, {
		backlightBackground: [0,0,0],
		backlightHorizontalLights: 5,
		backlightVerticalLights: 5,
		backlightSize: 50,
		backlightTimeout: 200
	});



	MediaElementPlayer.prototype.buildbacklight = function(player, controls, layers, media) {	
		if (!player.isVideo)
			return;
		
		//http://www.splashnology.com/blog/html5/382.html
		
		var 
			mediaContainer = player.container.find('.mejs-mediaelement').parent(),
			border = $('<div class="mejs-border"></div>')
				.prependTo(mediaContainer)
				.css('position','absolute')
				.css('top','-10px')
				.css('left','-10px')
				.css('border','solid 10px #010101')
				.width(player.width).height(player.height),	
			base = $('<div class="mejs-backlight"></div>')
				.prependTo(mediaContainer)
				.css('position','absolute')
				.css('top',0)
				.css('left',0)
				.width(player.width).height(player.height),
			timeOut = 200,
			hBlocks = 6,
			hWidth = player.width / hBlocks,
			hHeight = 50,
			vBlocks = 4,		
			vWidth = 50,
			vHeight = player.height / vBlocks,
			i,
			canvas = document.createElement('canvas'),
			context = canvas.getContext('2d'),
			pixels,
			keepUpdating = true,
			isActive = true,
			timer = null;
			
		canvas.width = player.width;
		canvas.height = player.height;
		
		$('<div class="mejs-backlight"><span></span></div>')
			.appendTo(controls)
			.click(function() {
				if (isActive) {
					timer = null;
					delete timer;
					base.empty();
				} else {
					updateLights();
				}
				isActive = !isActive;				
			});
		
		// http://www.splashnology.com/blog/html5/382.html
		function updateLights() {
			
			// get a copy of video
			context.drawImage(media, 0, 0, media.width, media.height);	
			
			addLights(base, canvas, context, vBlocks, hBlocks, 40, 30);

			
			if (keepUpdating && isActive) {
				timer = setTimeout(updateLights, timeOut);
			}
		}
		

		
			
		//setTimeout(updateLights, timeOut);	
			
		media.addEventListener('play',function() {
			if (isActive) {
				keepUpdating = true;
				updateLights();			
			}
		});
		media.addEventListener('pause',function() {
			keepUpdating = false;
		});	
		media.addEventListener('ended',function() {
			keepUpdating = false;
		});			
		
	};	
	
	
	
	function addLights(base, canvas, context, vBlocks, hBlocks, size, depth) {
		base.empty();
		
		var 
			lightsCanvas = document.createElement('canvas'),
			lightsContext = lightsCanvas.getContext('2d'),
			glowCanvas = document.createElement('canvas'),
			glowContext = glowCanvas.getContext('2d'),
			width = canvas.width,
			height = canvas.height,
			g,
			topLights = getMidColors(canvas, context, hBlocks, depth, 'top'),
			bottomLights = getMidColors(canvas, context, hBlocks, depth, 'bottom'),
			leftLights = getMidColors(canvas, context, vBlocks, depth, 'left'),
			rightLights = getMidColors(canvas, context, vBlocks, depth, 'right'),
			corners = [];
		
		glowCanvas.width = lightsCanvas.width = width + size + size;
		glowCanvas.height = lightsCanvas.height = height + size + size;
		lightsContext.globalCompositeOperation = 'xor'; //'darker'; //'lighter';
			
		// draw four gradients
		// create corners
		corner[0] = averageColor(topLights[topLights.length-1], rightLights[0]);
		corner[1] = averageColor(bottomLights[topLights.length-1], rightLights[rightLights.length-1]);
		corner[2] = averageColor(topLights[topLights.length-1], rightLights[0]);
		corner[3] = averageColor(topLights[topLights.length-1], rightLights[0]);
		
		// top		
		gradient = context.createLinearGradient(size, size, width+size, size);		
		for (var i = 0, il = topLights.length; i < il; i++) {
			gradient.addColorStop(i / il, 'rgb(' + adjustColor(topLights[i]).join(',') + ')');
		}
		lightsContext.fillStyle = gradient;
		lightsContext.fillRect(size, 0, width, size);	

		// right		
		gradient = context.createLinearGradient(size+width, size, size+width, size+height);		
		for (var i = 0, il = rightLights.length; i < il; i++) {
			gradient.addColorStop(i / il, 'rgb(' + adjustColor(rightLights[i]).join(',') + ')');
		}
		lightsContext.fillStyle = gradient;
		lightsContext.fillRect(size+width, size, size+width+size, height);	

		
		// bottom		
		gradient = context.createLinearGradient(size, size+height, size+width, size+height);		
		for (var i = 0, il = bottomLights.length; i < il; i++) {
			gradient.addColorStop(i / il, 'rgb(' + adjustColor(bottomLights[i]).join(',') + ')');
		}
		lightsContext.fillStyle = gradient;
		lightsContext.fillRect(size, size+height, width, size);	

		// left		
		gradient = context.createLinearGradient(size, size, size, size+height);		
		for (var i = 0, il = leftLights.length; i < il; i++) {
			gradient.addColorStop(i / il, 'rgb(' + adjustColor(leftLights[i]).join(',') + ')');
		}
		lightsContext.fillStyle = gradient;
		lightsContext.fillRect(0, size, size, height);
		
		// corners
		lightsContext.fillStyle = 'rgb(' + adjustColor(topLights[0]).join(',') + ')';
		lightsContext.fillRect(0, 0, size, size);	

		lightsContext.fillStyle = 'rgb(' + adjustColor(topLights[topLights.length-1]).join(',') + ')';
		lightsContext.fillRect(width+size, 0, size+width+size, size);	

		lightsContext.fillStyle = 'rgb(' + adjustColor(bottomLights[0]).join(',') + ')';
		lightsContext.fillRect(0, size+height, size, size+height+size);	

		lightsContext.fillStyle = 'rgb(' + adjustColor(bottomLights[bottomLights.length-1]).join(',') + ')';
		lightsContext.fillRect(width+size, size+height, size+width+size, size+height+size);	
		
		
		// draw glow

		// top
		color = [34,34,34];
		gradient = addGlow(color,glowContext.createLinearGradient(size, size, size, 0));
		glowContext.fillStyle = gradient; 
		glowContext.fillRect(size, size, width, -size); 

		// tr
		gradient = addGlow(color,glowContext.createRadialGradient(width+size, size, 0, width+size, size, size));
		glowContext.fillStyle = gradient; 
		glowContext.fillRect(width+size, size, size, -size); 		

		// right
		gradient = addGlow(color,glowContext.createLinearGradient(width+size, size, width+size+size, size));
		glowContext.fillStyle = gradient; 
		glowContext.fillRect(width+size, size, size, height); 

		// br
		gradient = addGlow(color,glowContext.createRadialGradient(width+size, height+size, 0, width+size, height+size, size));
		glowContext.fillStyle = gradient; 
		glowContext.fillRect(width+size, height+size, size, size); 	

		// bottom
		var gradient = addGlow(color,glowContext.createLinearGradient(size, size+height, size, size+height+size));
		glowContext.fillStyle = gradient; 
		glowContext.fillRect(size, size+height, width, size); 

		// bl
		gradient = addGlow(color,glowContext.createRadialGradient(size, height+size, 0, size, height+size, size));
		glowContext.fillStyle = gradient; 
		glowContext.fillRect(0, height+size, size, size); 

		// left
		gradient = addGlow(color,glowContext.createLinearGradient(size, size, 0, size));
		glowContext.fillStyle = gradient; 
		glowContext.fillRect(size, size, -size, height); 

		// tl
		gradient = addGlow(color,glowContext.createRadialGradient(size, size, 0, size, size, size));
		glowContext.fillStyle = gradient; 
		glowContext.fillRect(0, 0, size, size); 		
			
		$(lightsCanvas)
			.css('position','absolute')
			.css('top',-size)
			.css('left',-size)
			.appendTo(base);
			
		$(glowCanvas)
			.css('position','absolute')
			.css('top',-size)
			.css('left',-size)
			.appendTo(base);			
	
				
	}	
	
	function addGlow(color, g) {
		g.addColorStop(0.0, 'rgba(' + color.join(',') + ',0)');
		g.addColorStop(1.0, 'rgba(' + color.join(',') + ',1)');	
		return g;
	}	
	
		
	
	
	function getMidColors(canvas, context, blocks, blockDepth, side) {
        var width = canvas.width,
			height = canvas.height,
			blockHeight = (side == 'top' || side == 'bottom') ? blockDepth : Math.ceil(height / blocks), // height of the analyzed block
			blockWidth = (side == 'top' || side == 'bottom') ? Math.ceil(width / blocks) : blockDepth,
			result = [],
			imgdata,
			i;
			
		if (side == 'top' || side == 'bottom') {			
			for (i = 0; i < blocks; i++) {	
				imgdata = context.getImageData(i*blockWidth, (side == 'top') ? 0 : height - blockHeight , blockWidth, blockHeight);
				result.push( 					
					calcMidColor(imgdata.data)
				);
			}			
		} else {
			
			for (i = 0; i < blocks; i++) {				
				imgdata = context.getImageData( (side == 'right') ? width - blockWidth : 0, i*blockHeight, blockWidth, blockHeight);				
				result.push( 
					calcMidColor(imgdata.data)
				);
			}			
		}


        return result;
	}	
	
	// average color for a block
	function calcMidColorVertical(data, from, to) {
		var result = [0, 0, 0];
		var totalPixels = (to - from) / 4;

		for (var i = from; i <= to; i += 4) {
			result[0] += data[i];
			result[1] += data[i + 1];
			result[2] += data[i + 2];
		}

		result[0] = Math.round(result[0] / totalPixels);
		result[1] = Math.round(result[1] / totalPixels);
		result[2] = Math.round(result[2] / totalPixels);

		return result;
	}

	// average color for a block
	function calcMidColor(data) {
		var result = [0, 0, 0];
		var totalPixels = data.length;

		for (var i = 0; i < totalPixels; i += 4) {
			result[0] += data[i];
			result[1] += data[i + 1];
			result[2] += data[i + 2];
		}

		result[0] = Math.round(result[0] / totalPixels);
		result[1] = Math.round(result[1] / totalPixels);
		result[2] = Math.round(result[2] / totalPixels);

		return result;
	}	
	
	function adjustColor(color) {
		color = rgb2hsv(color);
		color[1] = Math.min(100, color[1] * 1.2); //1.4); // saturation
		color[2] = 80; //Math.min(100, color[2] * 2.7); //2.7); // brightness
		return hsv2rgb(color);
	}	
	
	function rgb2hsv(color) {
		var r = color[0] / 255,
			g = color[1] / 255,
			b = color[2] / 255,
			
			x, val, d1, d2, hue, sat, val;
		
		x = Math.min(Math.min(r, g), b);
		val = Math.max(Math.max(r, g), b);
		//if (x == val)
		//	throw Error('h is undefined');

		d1 = (r == x) ? g-b : ((g == x) ? b-r : r-g);
		d2 = (r == x) ? 3 : ((g == x) ? 5 : 1);

		hue = Math.floor((d2 - d1 / (val - x)) * 60) % 360;
		sat = Math.floor(((val - x) / val) * 100);
		val = Math.floor(val * 100);
		return [hue, sat, val];
	}

	/**
	 * Convers HSV color to RGB model
	 * @param {Number[]} RGB color
	 * @return {Number[]} HSV color
	 */
	function hsv2rgb(color) {
		var h = color[0],
			s = color[1],
			v = color[2];

		var r, g, a, b, c, s = s / 100, v = v / 100, h = h / 360;

		if (s > 0) {
			if (h >= 1) h=0;

			h = 6 * h;
			var f = h - Math.floor(h);
			a = Math.round(255 * v * (1 - s));
			b = Math.round(255 * v * (1 - (s * f)));
			c = Math.round(255 * v * (1 - (s * (1 - f))));
			v = Math.round(255 * v);

			switch (Math.floor(h)) {
				case 0: r = v; g = c; b = a; break;
				case 1: r = b; g = v; b = a; break;
				case 2: r = a; g = v; b = c; break;
				case 3: r = a; g = b; b = v; break;
				case 4: r = c; g = a; b = v; break;
				case 5: r = v; g = a; b = b; break;
			}

			return [r || 0, g || 0, b || 0];

		} else {
			v = Math.round(v * 255);
			return [v, v, v];
		}
	}	
	
	
})(jQuery);