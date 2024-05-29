var canRestAfter = performance.now() + 10000;
var SLEEP = {
	ing: false,
	rest: false,
	start: 0,
	end: 0
}

let lastZSpawn = 0;
//every frame
function restUpdate (delta) {
	if (!SLEEP.ing) {

		//check if it should rest (half speed when idle)
		if (performance.now() > canRestAfter && GAME.pet.level > 0 && GAME.tutorial > 4) {
			GAME.pet.happiness += delta * (100 / restLength()) / 3
			if (GAME.pet.happiness > 100) GAME.pet.happiness = 100;
			SLEEP.rest = true;
		}
		else SLEEP.rest = false;
		return;
	}

	//pet is sleeping
	GAME.pet.happiness += delta * (100 / restLength())

	if (performance.now()-lastZSpawn>500){
		lastZSpawn = performance.now();
		Particles.push(
			{
			"color": "white",
			"shape": "z",
			"age": 0,
			"lifespan": 100,
			"position": {
				"x": 4 + GAME.pet.position.x + 4 + round(GAME.pet.level/2),
				"y": 15 + GAME.pet.position.y +2
			},
			"velocity": {
				"x": 0,
				"y": -0.5
			},
			"bouncey": 9999,
			"gravity": 0.001,
			});
	}

	//
	if (GAME.pet.happiness > 100) GAME.pet.happiness = 100;

	//check if sleep is done
	if (performance.now() > SLEEP.end || GAME.pet.happiness == 100) {
		console.log('done resting')
		SLEEP.ing = false;
		SOUND.bgmusic.volume = GAME.settings.music;

		//TUTORIAL
		if (GAME.tutorial == 4) GAME.tutorial = 5;
	}

	
}

function rest () {
	console.log('resting')
	SLEEP.ing = true;
	SLEEP.start = performance.now();
	SLEEP.end = performance.now() + restLength()*1000;
	SOUND.bgmusic.volume = GAME.settings.music / 2;

	if (GAME.pet.happiness > 100) 
		GAME.pet.happiness = 100;

}

function restLength (level = GAME.pet.level, upgradeLevel = GAME.upgrades.shelter) {
	return bigger(1,level-upgradeLevel);
	//return Math.floor(Math.pow(Math.max(1,level-upgradeLevel) * 1.1, 1.1));
}

function restLengthDisplay (level = GAME.pet.level, upgradeLevel = GAME.upgrades.shelter) {
	let RL = restLength(level, upgradeLevel);

	//under a minute, seconds only
	if (RL < 60) return RL + 's';

	//return minutes and seconds
	return Math.floor(RL/60)+'m'+(RL%60)+'s';
}



//for (var i = 0; i < 100; i++) console.log('REST TEST: Lv.'+i, restLengthDisplay(i))