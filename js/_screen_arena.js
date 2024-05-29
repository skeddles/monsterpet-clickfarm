var currentArena = 1;

var BATTLE = {
	ing: false,
	firstTurn: true,
	winSign: 1,
	loseSign: 1,
	player: {
		hp: 100,
		hpDisplay: 100,
		spriteSize: 8,
		attackedLast: false,
		animation: false,
		x: 0,
		y: 0,
		xDisplay: 0,
	},
	enemy: {
		hp: 100,
		hpDisplay: 100,
		spriteSize: 8,
		spriteOffset: 64,
		animation: false,
		x: 0,
		xDisplay: 0,
	},
	hit: {
		x: 0,
		y: 0,
		elapsed: 1,
	},
	crowd: []
};

console.log('sd')

const flagData = [
	[],
	[1,48,112,141],
	[1,45,112,141],
	[1,44,112,141],
	[2,40,102,139],
	[2,39,102,139],
	[3,38,92,137,-1],
	[3,37,92,137,-1],
	[4,35,82,135,0],
	[4,35,72,145],
	[4,35,72,145],
	[5,32,66,139], //count y x x statueYOffset
]

var arenaScreen = {
	draw: (delta) => {

		if (BATTLE.ing) {
			playAnimations(delta);

			//bg
			CTX.drawImage(IMAGE['ui'], 100, 60, 128, 64, 64, 27, 128, 64);

			//crowd
			BATTLE.crowd.forEach(c => {
				CTX.drawImage(IMAGE['ui'], 334 + 5*c[2], 96 + 6*c[3], 5, 6, c[0], c[1] - Math.floor((performance.now())/c[4])%2, 5, 6);
				//CTX.drawImage(IMAGE['ui'], 334, 96, 5, 6, c[0], c[1], 5, 6);
			});
			
			//crowd statue overlay
			CTX.drawImage(IMAGE['ui'], 100, 175, 128, 15, 64, 27, 128, 15);
			
		//DRAW PETS
			CTX.drawImage(IMAGE['pets'],
			/*src x,y*/	GAME.pet.spriteX, GAME.pet.id*64,
			/*src wh*/	BATTLE.player.spriteSize,BATTLE.player.spriteSize,
			/*des x*/	round(64+BATTLE.player.xDisplay), 
			/*des y*/	round(27+BATTLE.player.y),
			/*des wh*/  BATTLE.player.spriteSize,BATTLE.player.spriteSize);

			//enemy
			CTX.scale(-1, 1);
			CTX.translate(-W, 0);
			CTX.drawImage(IMAGE['pets'],
			/*src x,y*/	BATTLE.enemy.spriteX, BATTLE.enemy.id*64,
			/*src wh*/	BATTLE.enemy.spriteSize, BATTLE.enemy.spriteSize,
			/*des x*/	round(64+BATTLE.enemy.xDisplay), 
			/*des y*/	round(27+BATTLE.enemy.y),
			/*des wh*/  BATTLE.enemy.spriteSize,BATTLE.enemy.spriteSize);
			//battle hit fx
			if (BATTLE.player.attackedLast && BATTLE.hit.elapsed < 1) CTX.drawImage(IMAGE['ui'], 228 + Math.floor(BATTLE.hit.elapsed*5)*15, 95, 15, 15, BATTLE.hit.x, BATTLE.hit.y, 15,15);
			CTX.translate(W, 0);
			CTX.scale(-1, 1);

			//battle hit fx
			if (!BATTLE.player.attackedLast && BATTLE.hit.elapsed < 1) CTX.drawImage(IMAGE['ui'], 228 + Math.floor(BATTLE.hit.elapsed*5)*15, 95, 15, 15, BATTLE.hit.x, BATTLE.hit.y, 15,15);



			//WIN / LOSE signs
			if (BATTLE.winSign < 1) 
				CTX.drawImage(IMAGE['ui'], 2, 126, 96, 48, 80, 28 + round(48*BATTLE.winSign), 96, 48);
			if (BATTLE.loseSign < 1) 
				CTX.drawImage(IMAGE['ui'], 100, 126, 96, 48, 80, 28 + round(48*BATTLE.loseSign), 96, 48);
		}

		//not in battle
		else {
			//bg
			CTX.drawImage(IMAGE['ui'], 485, 61, 128, 64, 64, 27, 128, 64);

			//clouds
			CTX.drawImage(IMAGE['ui'], 230, 171, 256, 22, 64 - floor(performance.now()/500)%256, 27, 256, 22);
			CTX.drawImage(IMAGE['ui'], 230, 171, 256, 22, 64+256 - floor(performance.now()/500)%256, 27, 256, 22);//looping

			//building
			let buildingX = 384;
			let buildingY = 324;
			if (currentArena < 12) {
				buildingX = (currentArena-1)%4*128;
				buildingY = 196 + floor((currentArena-1)/4)*64;
			}
			CTX.drawImage(IMAGE['ui'], buildingX, buildingY, 128, 64, 64, 27, 128, 64);

			//flags
			let flag = flagData[smaller(11,currentArena-1)];
			if (flag.length > 0) {
				CTX.drawImage(IMAGE['ui'], 0, 91 + floor(performance.now()/100)%4*8, flag[0]*12,8, flag[2],flag[1], flag[0]*12,8);
				CTX.drawImage(IMAGE['ui'], 0, 91 + floor(performance.now()/100)%4*8, flag[0]*12,8, flag[3],flag[1], flag[0]*12,8);
			}

			//statue overlay
			if (typeof flag[4] == 'number')
				CTX.drawImage(IMAGE['ui'], 83, 177, 10,12, 123,flag[1]-1+flag[4], 10,12);
			
		}

		//ui mask
		CTX.drawImage(IMAGE['arena'], 0, 0);

		//level
		CTX.fillText(currentArena, 33, 66, '#fede4b', 'center');

		//entry fee
		CTX.fillText(BATTLE.ing?'Prize:':'Entry Fee:', 226, 51, '#ab2b0b', 'center');
		CTX.fillText(BATTLE.ing?'Prize:':'Entry Fee:', 226, 50, '#ffffff', 'center');
		if (currentArena === 1 && !BATTLE.ing) CTX.fillText('Free', 226, 66, '#fede4b', 'center');
		else if (currentArena === 1 && BATTLE.ing) CTX.fillText('$16', 226, 66, '#fede4b', 'center');
		else CTX.fillText('$'+(calculateEntryFee() * (BATTLE.ing?2:1)), 226, 66, '#fede4b', 'center');

		//money
		CTX.fillText('$'+upgradeCostDisplay(GAME.money), 240, 10, '#ffa956', 'right');

	//BUTTONS
		if (BATTLE.ing) {

			//update animated bars
			if (BATTLE.player.hpDisplay > BATTLE.player.hp) BATTLE.player.hpDisplay--;
			if (BATTLE.enemy.hpDisplay > BATTLE.enemy.hp) BATTLE.enemy.hpDisplay--;

			//hide stuff
			CTX.fillRectColor('#e5552e',0,0,36,17);
			CTX.drawImage(IMAGE['ui'],228,60,256,35,0,95,256,35);


			//player hp bar
			let hungerBarSize = Math.round((BATTLE.player.hpDisplay / 100) * 60);
			CTX.drawImage(IMAGE['ui'],0,76,hungerBarSize,8,64,98,hungerBarSize,8);
			if (between(64,98,60,8))
				CTX.fillText(BATTLE.player.hpDisplay + '%', 96,105, '#ffffff', 'center');

			//enemy hp bar
			hungerBarSize = Math.round((BATTLE.enemy.hpDisplay / 100) * 60);
			CTX.drawImage(IMAGE['ui'],0,76,hungerBarSize,8,132,98,hungerBarSize,8);
			if (between(132,98,60,8))
				CTX.fillText(BATTLE.enemy.hpDisplay + '%', 164,105, '#ffffff', 'center');
		}
		else {
			drawButton('   Back', '#b8671f', 482, 35, 18, 1, -1);
			drawButton('    Prev', '#b8671f', 347, 45, 20, 8, 99, (currentArena > 1));
			drawButton('Next    ', '#b8671f', 392, 45, 20, 58, 99, (currentArena < GAME.unlockedArena));
			drawButton('Enter', '#b8671f', 437, 45, 20, 202, 99, currentArena == 1 || GAME.money >= calculateEntryFee());

		//TUTORIAL
			if (GAME.tutorial < 8) {
				//hide entry fee
				//CTX.fillRectColor('#e5552e',199,30,60,50);
				CTX.fillRectColor('#e5552e',0,92,194,36);
	
				if (GAME.tutorial == 6) {
					CTX.fillText('The first level is always free to enter!', 4, 105, '#ffffff');
					CTX.fillText('Click Enter to send your pet into the arena!', 4, 115, '#ffb762');
					CTX.fillText('Enter', 25, 116, '#9f2e10');
					CTX.fillText('Enter', 25, 115, '#ffe372');
				}
				if (GAME.tutorial == 7) {
					CTX.fillText('No one said it would be easy!', 4, 105, '#ffffff');
					CTX.fillText('Perhaps you should go Back and train a bit.', 4, 115, '#ffb762');
					CTX.fillText('Back', 106, 116, '#9f2e10');
					CTX.fillText('Back', 106, 115, '#ffe372');
				}
			}

			//TEST
			//CTX.fillText(GAME.tutorial, 72, 88, '#ffffff', 'right');
		}
	},
	click: (e) => {
		if (BATTLE.ing) return;

		//exit
		if (between(1, -1,35,18)) return GAME.screen = 'main';

		//battle
		if (between(202, 99, 45, 20)) {
			if (GAME.money < calculateEntryFee()) return console.error('player doesnt have enough money to pay');
			if (currentArena > 1) GAME.money -= calculateEntryFee();

			//init player
			BATTLE.player.spriteSize = Math.min(64,GAME.pet.level+8);
			BATTLE.player.hp = 100;
			BATTLE.player.hpDisplay = 100;
			BATTLE.player.x = 56 - BATTLE.player.spriteSize;
			BATTLE.player.y = 56 - BATTLE.player.spriteSize + Math.max(0,BATTLE.player.spriteSize-56);
			BATTLE.player.xDisplay = BATTLE.player.x;
			BATTLE.player.attackedLast = brandom();

			//init enemy
			BATTLE.enemy.level = Math.max(1, currentArena*5 + irandom(4) - 2); 
			BATTLE.enemy.hp = 100;
			BATTLE.enemy.hpDisplay = 100;
			BATTLE.enemy.spriteSize = BATTLE.enemy.level + 8;
			BATTLE.enemy.id = irandom(8);
			BATTLE.enemy.spriteX = calcPetSpriteXOffeset(BATTLE.enemy.level);
			BATTLE.enemy.x = 56 - BATTLE.enemy.spriteSize;
			BATTLE.enemy.y = 56 - BATTLE.enemy.spriteSize + Math.max(0,BATTLE.enemy.level-48);
			BATTLE.enemy.xDisplay = BATTLE.enemy.x;
			
			//advantages
			BATTLE.player.advantage = Math.max(0, GAME.pet.level - BATTLE.enemy.level);
			BATTLE.enemy.advantage = Math.max(0, BATTLE.enemy.level - GAME.pet.level);

			//init battle
			BATTLE.levelDifference = GAME.pet.level - BATTLE.enemy.level;
			BATTLE.firstTurn = true;
			BATTLE.levelDifference = Math.abs(GAME.pet.level, currentArena + irandom(4) - 2);
			BATTLE.winSign = 1;
			BATTLE.loseSign = 1;

			//init crowd
			BATTLE.crowd = [];
			let density = (currentArena/15 * Math.random());

			for (var cx = 0; cx < 25; cx++)
				for (var cy = 0; cy < 4; cy++) 
					if (Math.random() < density)
						BATTLE.crowd.push([64+cx*5+cy%2, 24+cy*3, irandom(2), irandom(2), Math.round(Math.random()*400)+100]);

			//start
			BATTLE.ing = true;
			doBattle();
			return;
		}

		//prev/next
		if (between(8, 99, 45, 20)) currentArena--;
		if (between(58, 99, 45, 20)) currentArena++;

		//check for valid current arena
		if (currentArena < 1) currentArena = 1;
		if (currentArena > GAME.unlockedArena) currentArena = GAME.unlockedArena;

	}
}

function doBattle () {
	setTimeout(() => {
		console.log('doing battle', (BATTLE.player.attackedLast?'enemy':'player'), 'attack')

		//if (BATTLE.player.attackedLast) {
		//	BATTLE.player.animation = 'forward';
		//}
		let attackingPlayer = BATTLE.player.attackedLast ? BATTLE.enemy : BATTLE.player;
		let defendingPlayer = BATTLE.player.attackedLast ? BATTLE.player : BATTLE.enemy;

		//jump forward
		animate (attackingPlayer, 'xDisplay', attackingPlayer.x+25, 100, ()=> {

			//show hit fx
			BATTLE.hit.x = round(130);
			BATTLE.hit.y = round(27 + attackingPlayer.y -7 + (attackingPlayer.spriteSize/2));
			BATTLE.hit.elapsed = 0;
			animate (BATTLE.hit, 'elapsed', 1, 100);

			SOUND.play('hit');

			//recoil
			animate (defendingPlayer, 'xDisplay', defendingPlayer.x+3, 50, ()=> {
				animate (defendingPlayer, 'xDisplay', defendingPlayer.x, 50);
			});

			//damage
			let damageDone = round((25+attackingPlayer.advantage*2) * (Math.random()+0.5) / (BATTLE.firstTurn?2:1));
			defendingPlayer.hp = Math.max(0, defendingPlayer.hp - damageDone);
			console.log(BATTLE.player.attackedLast ? 'enemy' : 'player', 'did',damageDone,'damage', '(advantage: '+attackingPlayer.advantage+')')

			//add damage particle effect
			Particles.push(
				{
				  "color": "white",
				  "shadowColor": "#6f0000",
				  "shape": "number",
				  "age": 0,
				  "lifespan": 60,
				  "position": {
					"x": 110 + (defendingPlayer==BATTLE.enemy?30:0),
					"y": 27 + defendingPlayer.y
				  },
				  "velocity": {
					"x": 0,
					"y": -0.5
				  },
				  "bouncey": 9999,
				  "gravity": 0.001,
				  "text": -damageDone
				});

			//return to starting position
			animate (attackingPlayer, 'xDisplay', attackingPlayer.x, 100, ()=> {
				console.log('move over')

				BATTLE.player.attackedLast = !BATTLE.player.attackedLast;
				BATTLE.firstTurn = false;

				//should battle continue
				if (BATTLE.player.hp > 0 && BATTLE.enemy.hp > 0)
					doBattle();

				//battle over
				else {
					let playerWon =  (BATTLE.player.hp > 0);

					let cryX = (!playerWon ? (64 + BATTLE.player.x + round(BATTLE.player.spriteSize/2)) : (192 - (BATTLE.enemy.x + round(BATTLE.enemy.spriteSize/2))));
					let cryY = 27 + (!playerWon ? (BATTLE.player.y + round(BATTLE.player.spriteSize/2)) : (	     BATTLE.enemy.y + round(BATTLE.enemy.spriteSize/2) ));
					let crying = setInterval(()=>{
						particleBurst({color: '#a3f5ff', amount: 5, life: {min: 2, max: 20}, velocity: {y: 0.4, x: 0.8}, position: {x: cryX, y: cryY}, gravity: 0.05});
					}, 300);

					//unlock next arena
					if (playerWon && GAME.unlockedArena < currentArena+1)  GAME.unlockedArena=currentArena+1;

					//show win/lose sign
					animate (BATTLE, playerWon?'winSign':'loseSign', 0, 300, ()=> {

							
						SOUND['bgmusic'].pause();
						SOUND.play(playerWon?'arena_win':'arena_lose');
						SOUND.play(playerWon?'arena_win':'arena_lose');

						//leave sign up for a bit, then return to prebattle screen
						setTimeout(()=>{
							if (playerWon && currentArena == 1) GAME.money += 16;
							else if (playerWon) GAME.money += calculateEntryFee()*2;
							clearInterval(crying);
							BATTLE.ing = false;

							saveGame();

							console.log(GAME.tutorial, 6 && !playerWon,GAME.tutorial == 6 && !playerWon)
							//tutorial
							if (GAME.tutorial == 6 && !playerWon) GAME.tutorial = 7;
							if (GAME.tutorial == 6 && playerWon || GAME.tutorial == 7 && playerWon) {
								GAME.tutorial = 8;
								GAME.screen = 'tutorial';
								SOUND['bgmusic'].pause();
								SOUND['tutorial_complete'].play();
							}

						}, 2000)
					});

				}
			});
		});

	}, 1000);
}


function calculateEntryFee (arena = currentArena) {
	if (arena == 1) return 0;
	return Math.floor(Math.pow(2, arena+4));
}

var animations = [];
function animate (object, property, endingValue, length, callback=false) {
	animations.push({
		object: object,
		property: property,
		length: length,
		startingValue: object[property],
		endingValue: endingValue,
		start: performance.now(),
		end: performance.now() + length,
		callback: callback,
	});
}

function playAnimations (delta) {
	animations.forEach((a,i) => {
		//animation should end
		if (performance.now() > a.end) {
			a.object[a.property] = a.endingValue;
			animations.splice(i, 1);
			if (a.callback) a.callback();
			return;
		}

		//animate property
		a.object[a.property] += (a.endingValue - a.startingValue) / (a.length/1000) * delta;
	});
}