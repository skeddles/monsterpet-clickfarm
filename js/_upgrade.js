function upgrade (stat) {
	let cost = upgradeCost(GAME.upgrades[stat]);

	if (GAME.money >= GAME.upgradeCost[stat]) {
		GAME.upgrades[stat] += 1;
		GAME.money -= cost;

		//update cost of next level
		GAME.upgradeCost[stat] = upgradeCost(GAME.upgrades[stat]);

		GAME.upgradeCostDisplay[stat] =  upgradeCostDisplay(GAME.upgradeCost[stat]);

		if (stat == 'food') GAME.foodCost = foodCost();

		SOUND.play('upgrade');

		saveGame();
	}
}

function upgradeCost (level) {
	let baseCost = Math.floor(Math.pow(level * 2 + 1, 3));
	return baseCost;
}

function upgradeCostDisplay (cost) {
	/* 999   */	if (cost < 1000) return cost;
	/* 99.9k */	if (cost < 100000) return Math.floor(cost/100)/10 + 'k';
	/* 999k  */	if (cost < 1000000) return Math.floor(cost/1000) + 'k';
	/* 99.9m */	if (cost < 100000000) return Math.floor(cost/100000)/10 + 'm';
	/* 999m  */	if (cost < 1000000000) return Math.floor(cost/1000000) + 'm';
	/* 99.9b */	if (cost < 100000000000) return Math.floor(cost/100000000)/10 + 'b';
	/* 999b  */	if (cost < 1000000000000) return Math.floor(cost/1000000000) + 'b';
	/* 99.9t */	if (cost < 100000000000000) return Math.floor(cost/100000000000)/10 + 't';
	/* 999t  */	if (cost < 1000000000000000) return Math.floor(cost/1000000000000) + 't';
	return 'Inf.'
}


function updateUpgradeCosts () {
	//init upgrade costs
	GAME.upgradeCost.food = upgradeCost(GAME.upgrades.food);
	GAME.upgradeCost.shelter = upgradeCost(GAME.upgrades.shelter);
	GAME.upgradeCost.equiptment = upgradeCost(GAME.upgrades.equiptment);

	//init upgrade costs for display
	GAME.upgradeCostDisplay.food = upgradeCostDisplay(GAME.upgradeCost.food);
	GAME.upgradeCostDisplay.shelter = upgradeCostDisplay(GAME.upgradeCost.shelter);
	GAME.upgradeCostDisplay.equiptment = upgradeCostDisplay(GAME.upgradeCost.equiptment);
}

updateUpgradeCosts();
//TEST UPGRADE LEVELS

console.log("UPGRADE COST TEST GAME.upgradeCostDisplay", GAME.upgradeCostDisplay)
console.log("UPGRADE COST TEST upgrades", GAME.upgrades, upgradeCost(GAME.upgrades.food))
for (var i = 0; i < 16; i++) console.log('UPGRADE COST TEST: Lv.'+i, upgradeCost(i), upgradeCostDisplay(upgradeCost(i)))