

const GAME = {
	screen: 'intro',
	tutorial: 0,
	money: 0,
	unlockedArena: 1,
	zone: 201,
	pet: {
		id: 0,
		name: 'Pooki',
		level: 0,
		spriteX: 0,
		xp: 0,
		hunger: 0,
		happiness: 100,
		position: {
			x: 60,
			y: 28},
		velocity: {
			x: 0.125,
			y: 0.0625},
	},
	upgrades: {
		food: 1,
		shelter: 1,
		equiptment: 1
	},
	foodCost: 0,
	upgradeCost: {
		food: 9,
		shelter: 9,
		equiptment: 9
	},
	upgradeCostDisplay: {
		food: 0,
		shelter: 0,
		equiptment: 0
	},
	settings: {
		music: 0.2,
		sound: 1,
	},
	stats: {
		clicks: 0,
		win: 0,
		lose: 0,
	}
}