
let lastSpawn = 0;

var tutorialScreen = {
	draw: (delta) => {
		CTX.drawImage(IMAGE['tutorial'], 0, 0);

		drawButton('Home', '#2d4da3', 302, 45, 20, 106, 95);

		//spawn a particle every 100ms
		if (performance.now()-lastSpawn>100){
			lastSpawn = performance.now();
			Particles.push({
				shape: 'confetti',
				color: Math.random()>0.5?'white':'#ead270',
				age: 0,
				lifespan: 350,
				position: {
					x: round(Math.random()*256), 
					y: 0 - Math.random()*25},
				velocity: {
					x: 0, 
					y: 0.5},
				gravity: 0
			});
		}


	},
	click: (e) => {
		//home button
		if (between(106, 95,45,20)) {
			GAME.screen = 'main';
			SOUND['tutorial_complete'].pause();
			SOUND['tutorial_complete'].volume = GAME.settings.music;
			SOUND['tutorial_complete'].currentTime = 0;
			SOUND['bgmusic'].play();
		}
	}
}
