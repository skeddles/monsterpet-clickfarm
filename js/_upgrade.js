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

	let baseCost = Math.floor(Math.pow(level * 4, 3));
	return baseCost;
console.log('bc',baseCost)
	if (baseCost < 1000) return baseCost; //0-1000
	if (baseCost < 100000) return round(baseCost/100) * 100; //1000 - 100k
	if (baseCost < 1000000) return round(baseCost/1000) * 1000; //100k-1m

	if (baseCost < 100000000) return round(baseCost/1000000) * 1000000; //1m-10m
	if (baseCost < 10000000) return round(baseCost/100000) * 100000; //10m-

	return 'ppoop'

}

function upgradeCost2 (level) {
	let cost = Math.floor(Math.pow(level * 4, 3));
	// 999
	if (cost < 1000) return cost;
	// 99.9k
	if (cost < 100000) return Math.floor(cost/100) * 100;
	// 999k
	if (cost < 1000000) return Math.floor(cost/1000) * 1000;

	// 99.9m
	if (cost < 100000000) return Math.floor(cost/100000)/10 * 1000000;
	// 999m 
	if (cost < 1000000000) return Math.floor(cost/1000000) * 1000000;

	// 99.9b
	if (cost < 100000000000) return Math.floor(cost/100000000)/10  * 1000000000;
	// 999b
	if (cost < 1000000000000) return Math.floor(cost/1000000000)  * 1000000000;

	// 99.9t
	if (cost < 100000000000000) return Math.floor(cost/100000000000)/10  * 1000000000000;
	// 999t
	if (cost < 1000000000000000) return Math.floor(cost/1000000000000)  * 1000000000000;

	return Number.MAX_SAFE_INTEGER;
}

function upgradeCostDisplay (cost) {

	// 999
	if (cost < 1000) return cost;

	// 99.9k
	if (cost < 100000) return Math.floor(cost/100)/10 + 'k';
	// 999k
	if (cost < 1000000) return Math.floor(cost/1000) + 'k';

	// 99.9m
	if (cost < 100000000) return Math.floor(cost/100000)/10 + 'm';
	// 999m 
	if (cost < 1000000000) return Math.floor(cost/1000000) + 'm';

	// 99.9b
	if (cost < 100000000000) return Math.floor(cost/100000000)/10 + 'b';
	// 999b
	if (cost < 1000000000000) return Math.floor(cost/1000000000) + 'b';

	// 99.9t
	if (cost < 100000000000000) return Math.floor(cost/100000000000)/10 + 't';
	// 999t
	if (cost < 1000000000000000) return Math.floor(cost/1000000000000) + 't';

	return 'Inf.'
}

//init upgrade costs
GAME.upgradeCost.food = upgradeCost(GAME.upgrades.food);
GAME.upgradeCost.shelter = upgradeCost(GAME.upgrades.shelter);
GAME.upgradeCost.equiptment = upgradeCost(GAME.upgrades.equiptment);

//init upgrade costs for display
GAME.upgradeCostDisplay.food = upgradeCostDisplay(GAME.upgradeCost.food);
GAME.upgradeCostDisplay.shelter = upgradeCostDisplay(GAME.upgradeCost.shelter);
GAME.upgradeCostDisplay.equiptment = upgradeCostDisplay(GAME.upgradeCost.equiptment);


//TEST UPGRADE LEVELS
//for (var i = 0; i < 500; i++) console.log('UPGRADE COST TEST: Lv.'+i, upgradeCost(i), upgradeCost2(i), upgradeCostDisplay(upgradeCost(i)))