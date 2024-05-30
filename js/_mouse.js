const MOUSE_RECLICK_SPEED = 250; // ms
const CLICK_AFTER_HOLDING = 250; // ms

var Mouse = {
	x: 0,
	y: 0,
	pressed: false,
	lastPressed: 0,
	isHoldClicking: false,
	clientX: 0,
	clientY: 0,
}

CANVAS.onmousemove = function (e) {
	let rect = CANVAS.getBoundingClientRect();
	const DPR = window.devicePixelRatio;

	Mouse.x = (e.clientX - rect.left) / ZOOM * DPR; //x position within the element.
	Mouse.y = (e.clientY - rect.top) / ZOOM * DPR;  //y position within the element.
	Mouse.clientX = e.clientX;
	Mouse.clientY = e.clientY;
}

CANVAS.onmouseleave  = function (e) {
	Mouse.x = -1;
	Mouse.y = -1;
}

CANVAS.onmousedown = (e) => { 
	Mouse.lastPressed = performance.now();
	Mouse.pressed = true;
}

function checkMouseHeld() {
	if (!Mouse.pressed) return;

	if (Mouse.isHoldClicking) {
		if (performance.now() > Mouse.lastPressed + MOUSE_RECLICK_SPEED) {
			console.log("held for ",MOUSE_RECLICK_SPEED,"ms");
			fireClick();
		}
	}

	else {
		if (performance.now() > Mouse.lastPressed + CLICK_AFTER_HOLDING) {
			Mouse.isHoldClicking = true;
			console.log("started holding click");
			fireClick();
		}
	}
}

CANVAS.onmouseup  = function (e) {
	if (e.button !== 0) return;
	Mouse.pressed = false;
	if (Mouse.isHoldClicking) 
		Mouse.isHoldClicking = false;
	else
		fireClick(e);
}

function fireClick (e) {
	console.log('click');
	Mouse.lastPressed = performance.now();

	GAME.stats.clicks++;


	if (!e) {
		e = new MouseEvent('mouseup', {
			bubbles: true, 
			cancelable: true, 
			view: window, 
			button: 0,
			clientX: Mouse.clientX,
			clientY: Mouse.clientY,
		});
	}

	if (GAME.screen == 'main')
		return mainScreen.click(e);
	if (GAME.screen == 'intro')
		return introScreen.click(e);
	if (GAME.screen == 'arena')
		return arenaScreen.click(e);
	if (GAME.screen == 'tutorial')
		return tutorialScreen.click(e);
	if (GAME.screen == 'menu')
		return menuScreen.click(e);
}

function between (x,y,w,h) {
	return (Mouse.x > x && Mouse.x < x+w && Mouse.y > y && Mouse.y < y+h) || false;
}