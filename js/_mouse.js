
var Mouse = {
	x: 0,
	y: 0,
	pressed: false,
}

CANVAS.onmousemove = function (e) {
	let rect = CANVAS.getBoundingClientRect();
	const DPR = window.devicePixelRatio;

	Mouse.x = (e.clientX - rect.left) / ZOOM * DPR; //x position within the element.
	Mouse.y = (e.clientY - rect.top) / ZOOM * DPR;  //y position within the element.
}

CANVAS.onmouseleave  = function (e) {
	Mouse.x = -1;
	Mouse.y = -1;
}


CANVAS.onmousedown = (e) => { Mouse.pressed = true;}

CANVAS.onmouseup  = function (e) {
	if (e.button !== 0) return;
	Mouse.pressed = false;

	GAME.stats.clicks++;

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