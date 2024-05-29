function feed () {
	if (SLEEP.ing) return;

	if (GAME.pet.hunger >= maxHunger()) return;

	//use upgraded food
	if (GAME.money > foodCost()) {
		GAME.pet.hunger += round(GAME.upgrades.food * calcZoneMultiplier());
		GAME.money -= foodCost();
	}
	//use free food
	else GAME.pet.hunger += round(calcZoneMultiplier());

	//cap at max hunger
	if (GAME.pet.hunger > maxHunger()) GAME.pet.hunger = maxHunger();

	//eating particles
	particleBurst({color: '#77463c', shape: 'halfbig', amount: 5, bouncey: 79, life: {min: 1, max: 35}, velocity: {y: 0.5, x: 1}, position: {x: 4+GAME.pet.position.x+Math.floor((GAME.pet.level+8)/2), y: 15+GAME.pet.position.y+Math.floor((GAME.pet.level/2+8))}, gravity: 0.1});

	//sound effect
	SOUND.play('eat');

	//TUTORIAL
	if (GAME.tutorial == 1 && GAME.pet.hunger == maxHunger()) GAME.tutorial = 2;
}

function maxHunger () {
	return 8+GAME.pet.level;
}


function foodCost () {
	if (GAME.upgrades.food == 1) return 0;
	return Math.round(Math.pow(GAME.upgrades.food-1, 1.5));
}