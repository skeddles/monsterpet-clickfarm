
var last = 0;
function update (now) {
	
	//last = last || now;
	let delta = (now - last) / 1000;
	last = now;

	//if (now < 10000) console.log({now: now,delta: delta, last: last, screen: GAME.screen});
	
//DRAW

	CTX.fillRectColor('black',0,0,256,128);
	
	checkMouseHeld();

	if (GAME.screen == 'main')
		mainScreen.draw(delta);	
	if (GAME.screen == 'intro')
		introScreen.draw(delta);
	if (GAME.screen == 'arena')
		arenaScreen.draw(delta);
	if (GAME.screen == 'tutorial')
		tutorialScreen.draw(delta);
	if (GAME.screen == 'menu')
		menuScreen.draw(delta);

	renderParticles(delta);



	//next frame
	window.requestAnimationFrame(update);
}

