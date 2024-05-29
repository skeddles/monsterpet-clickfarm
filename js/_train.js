


function train() {
	if (SLEEP.ing) return;

	if ((GAME.pet.hunger >= 1 && GAME.pet.happiness > 0) || GAME.tutorial == 0) {
		GAME.pet.xp += round(GAME.upgrades.equiptment * calcZoneMultiplier());
		GAME.pet.hunger -= 1;
		GAME.pet.happiness -= 1;
		
		let percent = percentToNextLevel();

		//color: '#e0c12e' ,
		particleBurst({color: '#f3e14c', shape: 'halfbig', life: {min: 1, max: 35}, velocity: {y: 0.5, x: 0.5}, position: {x: 4+Math.floor(128 * percent), y:10}, gravity: 0.08});
		
		//TUTORIAL
		if (GAME.tutorial == 2 && GAME.pet.hunger == 0) GAME.tutorial = 3;
		if (GAME.tutorial == 3 && GAME.pet.happiness == 0) GAME.tutorial = 4;

		//LEVEL UP
		if (GAME.pet.xp >= xpNeededForLevel(GAME.pet.level+1)) {
			console.log('level up!');
			GAME.pet.level++;
			
			SOUND.play('levelup');

			particleBurst({color: '#e0c12e', shape: 'confetti', amount: 10, life: {min: 100, max: 200}, velocity: {y: 0.2, x: 0.5}, position: {x: 125, y:6}, gravity: 0.03});
			particleBurst({color: '#ffffff', shape: 'confetti', amount: 10, life: {min: 100, max: 200}, velocity: {y: 0.2, x: 0.5}, position: {x: 125, y:6}, gravity: 0.03});
		

			//calcualte sprite x
			GAME.pet.spriteX = calcPetSpriteXOffeset();

			saveGame();

			//TUTORIAL
			if (GAME.pet.level == 1) {
				let color = GAME.pet.id == 0 ? '#b83330' : (GAME.pet.id == 1 ? '#3ec72c' : '#1478de') 
				particleBurst({color: color, shape: 'halfbig', life: {min: 1, max: 35}, velocity: {y: 0.5, x: 0.5}, position: {x: GAME.pet.position.x+10, y:GAME.pet.position.y+24}, gravity: 0.08});
				GAME.tutorial = 1, GAME.pet.hunger = 0;
			}
			if (GAME.pet.level == 2) GAME.tutorial = 4, GAME.pet.happiness = 0;
			if (GAME.pet.level == 5 && GAME.tutorial == 5) GAME.tutorial = 6;
		}
		
		else {
			SOUND.play('xp'+ (1+Math.floor(percent*7)));
		}

		//let newLevel = levelFromXP(GAME.pet.xp+1); //for some reason without +1 it doesn't level you up until you pass the xp requirement
		//if (newLevel > GAME.pet.level)
		//	alert('level up!');
		//GAME.pet.level = newLevel;
	}
	
}

const XPCALC_BASE_MULTIPLIER = 8;
const XPCALC_POWER_MULTIPLIER = 1.2;
const XPCALC_LEVEL_DIVISOR = 50;

//calculate xp to level and back
function levelFromXP(xp) {			return Math.floor(Math.pow(xp		, 	1 / (XPCALC_POWER_MULTIPLIER+(GAME.pet.level/XPCALC_LEVEL_DIVISOR))	)  / XPCALC_BASE_MULTIPLIER	);}
function xpNeededForLevel(level) {	return Math.floor(Math.pow(level * XPCALC_BASE_MULTIPLIER, 	(XPCALC_POWER_MULTIPLIER+(level/XPCALC_LEVEL_DIVISOR))		)		);}

function percentToNextLevel() {
	let currentLevel = GAME.pet.level;
	let xpNeededForCurrentLevel = xpNeededForLevel(currentLevel);
	let xpNeededForNextLevel = xpNeededForLevel(currentLevel + 1);
	let xpNeededToLevelUp = xpNeededForNextLevel - xpNeededForCurrentLevel;
	let xpGainedOnLevelSoFar = GAME.pet.xp - xpNeededForCurrentLevel;
	return xpGainedOnLevelSoFar / xpNeededToLevelUp;
}

//calculates the x offset on the pet spritesheet based on level
function calcPetSpriteXOffeset (level = GAME.pet.level) {
	return Math.min(2044, [...Array(level)].reduce((p,c,i) => p+i+8+1, 0));
}

//TEST XP LEVELS
for (var i = 0; i < 56; i++) console.log('XP TEST: Lv.'+i, (xpNeededForLevel(i)-xpNeededForLevel(i-1))+'xp for this level',xpNeededForLevel(i),'total')