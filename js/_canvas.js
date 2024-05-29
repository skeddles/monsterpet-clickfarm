//get elements
const CANVAS = $('canvas');
const CTX = CANVAS.getContext("2d");
//CTX.translate(0.5, 0);
CTX.imageSmoothingEnabled = true;

//set static res
W = 256;
H = 128;
var ZOOM = 1;

//resize display canvas
CANVAS.width = W;
CANVAS.height = H;

resizeWindow();

console.log({zoom: ZOOM, width: W, height: H, canvas: {width: CANVAS.style.width, height: CANVAS.style.height}})

//drawing helper functions
CTX.fillRectColor = function () {
	let args = Array.from(arguments);
	CTX.fillStyle = args.shift();
	CTX.fillRect.apply(this, args);
}

var fontCanvas;
fontCanvas = document.createElement('canvas');
fontCanvas.style.outline = 'solid 1px grey';
if (DEBUG) 
	document.body.appendChild(fontCanvas);
fontCanvas.width = 240;
fontCanvas.height = 8;
var fontCanvasContext = fontCanvas.getContext('2d');

fontCanvasContext.font = '8px mainfont';
CTX.textAtlas = {};
CTX.fillText = function (text,x,y,color = '#ffffff',alignment = 'left') {
	if (text.length == 0) return console.error('tried to draw empty string');

	let id = 'c-' + color + '-' + alignment + '-' + text;

	//if the string has never been drawn before
	if (!CTX.textAtlas[id]) {
		console.log('we gotta cache ',id);

		let atlasIndex = Object.keys(CTX.textAtlas).length + 1;

		CTX.textAtlas[id] = atlasIndex;

		//convert color to rgb
		let colorRGB = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(color.trim());
		let finalDrawColor = [parseInt(colorRGB[1], 16), parseInt(colorRGB[2], 16), parseInt(colorRGB[3], 16), 255]

		//prepare canvas
		let atlasBackup = fontCanvasContext.getImageData(0,0,fontCanvas.width,fontCanvas.height);
		fontCanvas.height = 8 * (atlasIndex+1);
		fontCanvasContext.putImageData(atlasBackup,0,0)
		fontCanvasContext.fillStyle = 'white';
		fontCanvasContext.fillRect(0,8*atlasIndex,fontCanvas.width,8)
		fontCanvasContext.textAlign = alignment;
		fontCanvasContext.font = '8px mainfont';

		//calculate x position to draw text at, based on the alignment
		let drawXpostion = 0;
		if (alignment == 'right') drawXpostion = fontCanvas.width;
		if (alignment == 'center') {
			//we cant use center align because canvas sucks and centers it on a decimal, so we'll just center it ourselves
			fontCanvasContext.textAlign = 'left';
			let offset = Math.round(fontCanvasContext.measureText(text).width/2);
			drawXpostion = fontCanvas.width/2 - offset ;
		}

		//draw text
		fontCanvasContext.fillStyle = 'black';

		fontCanvasContext.fillText(text,drawXpostion,6+8*atlasIndex);

		//threshold the text (convert to just transparent and the fill color)
		let pixels = fontCanvasContext.getImageData(0,8*atlasIndex,fontCanvas.width,8);
		let threshold = 200;
		var d = pixels.data, i = 0, l = d.length;
		while (l-- > 0) {
			const v = d[i] * 0.2126 + d[i+1] * 0.7152 + d[i+2] * 0.0722;
			[d[i], d[i+1], d[i+2], d[i+3]] = v >= threshold ? [0,0,0,0] : finalDrawColor;
			i += 4;
		}
		fontCanvasContext.putImageData(pixels,0,0+8*atlasIndex);
	} 
	
	//draw text
	let drawXpostion = x;
	if (alignment == 'right') drawXpostion 	= x - fontCanvas.width;
	if (alignment == 'center') drawXpostion = x - fontCanvas.width/2;
	
	CTX.drawImage(fontCanvas,
		0, 8*CTX.textAtlas[id], //source x,y
		fontCanvas.width,8, //src width,height
		drawXpostion, y-6,//dest x,y
		fontCanvas.width, 8 //dest width,height
	);
	
}


function drawButton (text, shadowColor, srcX, w, h, x, y, enabled = true) {
	let isHovered = (Mouse.x > x && Mouse.x < x+w && Mouse.y > y && Mouse.y < y+h) || false;
	let isPressed = (isHovered && Mouse.pressed) || false;

	//can afford
	if (enabled) {
		//hover bg
		if (isHovered) CTX.drawImage(IMAGE['ui'],srcX,isPressed?40:0,w,h,x,y,w,h);
	
		//text
		CTX.fillText(text, x+round(w/2), y+12 + (isPressed?2:0), shadowColor, 'center');
		CTX.fillText(text, x+round(w/2), y+11 + (isPressed?2:0), '#ffffff', 'center');
	} else {
		CTX.drawImage(IMAGE['ui'],srcX,20,w,h,x,y,w,h);
		CTX.fillText(text, x+round(w/2), y+13, '#3e424d', 'center');
	}
}

function resizeWindow () {
	

	//calculate zoom level and apply
	ZOOM = Math.max(1, Math.floor(Math.min(window.innerWidth/W, window.innerHeight/H)));

	//zoom canvas 
	CANVAS.style.width = W * ZOOM;
	CANVAS.style.height = H * ZOOM;

	console.log('resized window to',ZOOM);
}


//resize whenever window is adjusted
window.addEventListener('resize', resizeWindow);