
const TESTPETRESOLUTION = false;
/*localStorage.setItem('monsterclickfarm',null);
GAME.screen = 'main';
GAME.pet.id = 0;*/

var mainScreen = {
	draw: (delta) => {

		restUpdate(delta);
		let spriteSize = Math.min(64,GAME.pet.level+8);

		//move pet
		if (!SLEEP.ing && GAME.pet.level > 0) {
			
			//flip pets velocity if at edge of screen
			if (GAME.pet.position.x+GAME.pet.velocity.x < 0 	|| GAME.pet.position.x+GAME.pet.velocity.x+spriteSize > 128) GAME.pet.velocity.x = -GAME.pet.velocity.x;
			if (GAME.pet.position.y+GAME.pet.velocity.y < 0 	|| GAME.pet.position.y+GAME.pet.velocity.y+spriteSize > 64) GAME.pet.velocity.y = -GAME.pet.velocity.y;
			
			//move pet based on velocity
			GAME.pet.position.x = GAME.pet.position.x + GAME.pet.velocity.x;
			if (GAME.pet.level < 56) GAME.pet.position.y = GAME.pet.position.y + GAME.pet.velocity.y;
			
			//make sure pet position isnt out of bounds
			if (GAME.pet.position.x < 0) GAME.pet.position.x = 0;
			if (GAME.pet.position.y < 0) GAME.pet.position.y = 0;
			if (GAME.pet.position.x > 128 - spriteSize) GAME.pet.position.x--;
			if (GAME.pet.position.y > 64 - spriteSize) GAME.pet.position.y--;
		}
		/*
		GAME.pet.hunger=maxHunger();
		GAME.pet.happiness=100;
		train();
		GAME.pet.position.x = 75 - floor(GAME.pet.level/2);
		GAME.pet.position.y = 28 - floor(GAME.pet.level/2);
		GAME.pet.name = '';*/

		let foodCost = GAME.money >= GAME.foodCost? GAME.foodCost : 0;
		let foodAmount = round ( (GAME.money >= GAME.foodCost? GAME.upgrades.food : 1) * calcZoneMultiplier() );

		CTX.drawImage(IMAGE['bg'], 0, 0);
	
		//pet info
		CTX.fillText(GAME.pet.name, 5, 8, '#ffffff');
		if (GAME.pet.level == 0)
			CTX.fillText('Egg', 132, 8, '#ffffff', 'right');
		else if (between(4,2,128,12))
			CTX.fillText(GAME.pet.xp + '/' + xpNeededForLevel(GAME.pet.level+1) + ' XP', 132, 8, '#ffffff', 'right');
		else
			CTX.fillText('Lv. '+GAME.pet.level, 132, 8, '#ffffff', 'right');
	
		CTX.fillRectColor('#e0c12e', 4, 10, Math.floor(128 * percentToNextLevel()), 2);
	
		//stat bars
		let hungerBarSize = Math.round((GAME.pet.hunger / maxHunger()) * 97);
		CTX.drawImage(IMAGE['ui'],0,60,hungerBarSize,8,35,82,hungerBarSize,8);
		if (between(4,82,97+28,8))
			CTX.fillText(GAME.pet.hunger + '/' + maxHunger(), 85, 88, '#ffffff', 'center');
	
		let happinessBarSize = Math.round((GAME.pet.happiness / 100) * 97);
		CTX.drawImage(IMAGE['ui'],0,68,happinessBarSize,8,35,92,happinessBarSize,8);
		if (between(4,92,97+28,8))
			CTX.fillText(round(GAME.pet.happiness) + '%', 85, 98, '#ffffff', 'center');
	
		//action buttons
		drawActionButton('Feed', 138, 15, GAME.pet.hunger < maxHunger());
		drawActionButton(GAME.pet.level==0?'Hatch':'Train', 138, 37, GAME.tutorial == 0 || (GAME.pet.hunger >= 1 && GAME.pet.happiness > 0));
		drawActionButton('Rest', 138, 59, GAME.pet.happiness < 100);


	
	//RIGHT SIDE
		//CTX.fillText('$'+GAME.money.toLocaleString("en-US"), 242, 10, '#93beff', 'right');
		let amountTextColor = GAME.zone<200? '#fdbf2b' : '#4ccfdb';
		CTX.fillText('$'+upgradeCostDisplay(GAME.money), 242, 10, '#93beff', 'right');
		CTX.fillText('$'+foodCost +' / +'+ foodAmount, 209, 29, amountTextColor);
		CTX.fillText('+'+round(GAME.upgrades.equiptment*calcZoneMultiplier())+' XP', 209, 51, amountTextColor);
		CTX.fillText(restLengthDisplay(), 209, 73, '#4ccfdb');
	
		drawButton('Arena', '#b9361c', 100, 67, 20, 138, 81, !SLEEP.ing);
		drawButton('Menu', '#3b57b6', 167, 45, 20, 208, 81);
	
	
		//upgrade buttons
		drawUpgradeButton('food', 2, 108);
		drawUpgradeButton('equiptment', 86, 108);
		drawUpgradeButton('shelter', 182, 108);
	
		//upgrades values
		CTX.fillText('Lv. '+GAME.upgrades.food, 58, 124, '#4ccfdb', 'center');
		CTX.fillText('Lv. '+GAME.upgrades.equiptment, 142, 124, '#4ccfdb', 'center');
		CTX.fillText('Lv. '+GAME.upgrades.shelter, 239, 124, '#4ccfdb', 'center');


		//temp sprite draw
		//CTX.fillRectColor('#ff0000', round(4+GAME.pet.position.x), round(15+GAME.pet.position.y), GAME.pet.level+8, GAME.pet.level+8);

		//test pet draw
		if (TESTPETRESOLUTION) {
			let lvl = round(Mouse.x - 4);
			if (lvl < 0) lvl = 0;
			if (lvl > 56) lvl = 56;
			let spriteX = GAME.pet.spriteX = [...Array(lvl)].reduce((p,c,i) => p+i+8+1, 0);
			CTX.drawImage(IMAGE['pets'],
			/*src x,y*/	spriteX, GAME.pet.id*64,
			/*src wh*/	lvl+8,lvl+8,
			/*des x*/	5, 
			/*des y*/	16,
			/*des wh*/  lvl+8,lvl+8);
			CTX.fillText(lvl, 5, 64+12, '#000000');
		}


	//DRAW PET

		//flip
		let FLIP = GAME.pet.velocity.x < 0;
		if (FLIP) {
			CTX.scale(-1, 1);
			CTX.translate(-W, 0);	
		}

		
		CTX.drawImage(IMAGE['pets'],
		/*src x,y*/	GAME.pet.spriteX, GAME.pet.id*64,
		/*src wh*/	spriteSize,spriteSize,
		/*des x*/	FLIP ? (W - round(4+GAME.pet.position.x) - spriteSize) : (round(4+GAME.pet.position.x)), 
		/*des y*/	round(15+GAME.pet.position.y),
		/*des wh*/  spriteSize,spriteSize);

		//flip
		if (FLIP) {
			CTX.translate(W, 0);
			CTX.scale(-1, 1);
		}

	//IN THE ZONE 
		if (GAME.zone < 200) {
			CTX.drawImage(IMAGE['ui'], 351,96, 123,27, 6,52, 123,27);
			CTX.fillText('YOU\'RE IN THE ZONE!', 57, 75 + Math.floor((performance.now())/100)%2, '#e5552e', 'center');
			CTX.fillText(calcZoneMultiplier() + 'x', 109, 75, '#ffba83', 'center');
		}

	//TUTORIAL

		/*if (GAME.tutorial < 9) {
			//hide upgrades
			CTX.fillRectColor('#3856b8',86,106,256,22);

			if (GAME.tutorial == 8) {
				CTX.fillText('Congrats on the win! Since we\'ve got', 80, 114, '#ffffff');
				CTX.fillText('money now, we can upgrade our food.', 80, 124, '#ffffff');
			}
		}*/

		if (GAME.tutorial < 8) {
			//hide upgrades
			CTX.fillRectColor('#3856b8',0,106,256,22);

			//hide menu button
			CTX.fillRectColor('#3856b8',208,81,46,22);

			if (GAME.tutorial == 6) {
				CTX.fillText('Wow, look how big it\'s getting!  ', 4, 114, '#ffffff');
				CTX.fillText('It could probably fight in', 139, 114, '#93beff');
				CTX.fillText('the arena and earn money! Click Arena to enter!', 4, 124, '#93beff');
				CTX.fillText('Arena', 145, 125, '#263b81');
				CTX.fillText('Arena', 145, 124, '#ff845f');
			}
		}
		if (GAME.tutorial < 6) {
			//hide arena / menu
			CTX.fillRectColor('#3856b8',138,81,115,21);

			if (GAME.tutorial == 4) {
				CTX.fillText('Oh, now now your monster', 138, 88, '#ffffff');
				CTX.fillText('is tired. Better rest!', 138, 98, '#ffffff');
			}
			if (GAME.tutorial == 5) {
				CTX.fillText('All rested!', 138, 88, '#ffffff');
				CTX.fillText('Keep on training!', 138, 98, '#93beff');
			}
		}	
		if (GAME.tutorial < 4) {
			//hide resting
			CTX.fillRectColor('#3856b8',138,59,115,21);
			//hide energy bar
			CTX.fillRectColor('#3856b8',4,92,128,10);
			
			if (GAME.tutorial == 2) {
				CTX.fillText('All better!', 138, 68, '#ffffff');
				CTX.fillText('Now you can', 185, 68, '#93beff');
				CTX.fillText('begin training your', 138, 78, '#93beff');
				CTX.fillText('monster! Click Train ', 138, 88, '#93beff');
				CTX.fillText('Train ', 199, 89, '#263b81');
				CTX.fillText('Train ', 199, 88, '#cfff68');
				CTX.fillText('above to start! ', 138, 98, '#93beff');
			}
			else if (GAME.tutorial == 3) {
				CTX.fillText('Uh oh!', 138, 66, '#ffffff');
				CTX.fillText('Your monster got', 167, 66, '#93beff');
				CTX.fillText('hungry again! Keep it', 138, 76, '#93beff');
				CTX.fillText('fed so you can keep ', 138, 86, '#93beff');
				CTX.fillText('on training.', 138, 96, '#93beff');
			}
		}	
		if (GAME.tutorial == 1) {
			//hide training
			CTX.fillRectColor('#3856b8',138,37,115,21);
			CTX.fillText('Oh look, it hatched! ', 139, 55, '#ffffff');
			CTX.fillText('It\'s probably hungry, try', 139, 65, '#93beff');
			CTX.fillText('feeding it with the feed', 139, 75, '#93beff');
			CTX.fillText('button above!', 139, 85, '#93beff');

		}	
		if (GAME.tutorial == 0) {
			//hide feeding
			CTX.fillRectColor('#3856b8',138,15,115,21);
			//hide hunger bar
			CTX.fillRectColor('#3856b8',4,82,128,20);
			//hide xp amount
			CTX.fillRectColor('#3856b8',204,40,49,16);
			CTX.fillText('Check out your new monster egg!', 128, 89, '#ffffff', 'center');
			CTX.fillText('Click the hatch button to help it along!', 128, 99, '#93beff', 'center');
		}	


		//testing draw tutorial number
		//CTX.fillText(GAME.tutorial, 128, 78, '#000000', 'right');
	},
	click: (e) => {
		//reset auto resting
		canRestAfter = performance.now() + 5000;

		if (SLEEP.ing) SLEEP.ing = false;

		//action buttons
		if (between(138,15,63,20) && GAME.tutorial > 0) feed();
		if (between(138,37,63,20) && GAME.tutorial !== 1) train();
		if (between(138,59,63,20) && GAME.tutorial > 2) rest();

		//upgrade buttons
		if (between(2,108,37,18)) upgrade('food');
		if (between(86,108,37,18)) upgrade('equiptment');
		if (between(182,108,37,18)) upgrade('shelter');

		//arena
		if (between(138,81,67,20) && GAME.tutorial > 5 && !SLEEP.ing) {
			setCurrentArena();
			GAME.screen = 'arena';
		}

		//menu
		if (between(208,81,45,20) && GAME.tutorial > 7) GAME.screen = 'menu';



		//in the zone tracker
		if (GAME.tutorial>7) 
			ZONECLICKS.push(performance.now());

		if (ZONECLICKS.length>10) {
			ZONECLICKS.shift();
			GAME.zone = (performance.now() - ZONECLICKS[0]) / 10;

			//increase pet velocity if in zone
			if (GAME.zone<200) {
				GAME.pet.velocity = {x: 0.125 *2 * calcZoneMultiplier() * Math.sign(GAME.pet.velocity.x), y: 0.0625*2*calcZoneMultiplier() * Math.sign(GAME.pet.velocity.y)};
				SOUND.bgmusic.playbackRate = 1 + ((calcZoneMultiplier()-1)/2);
			}
			else GAME.pet.velocity = {x: 0.125 * Math.sign(GAME.pet.velocity.x), y: 0.0625 * Math.sign(GAME.pet.velocity.y)};

			//timeout to turn off zone
			clearTimeout(GAME.zoneTimeout);
			GAME.zoneTimeout = setTimeout(()=>{
				GAME.zone = 201;
				GAME.pet.velocity = {x: 0.125 * Math.sign(GAME.pet.velocity.x), y: 0.0625 * Math.sign(GAME.pet.velocity.y)};
				SOUND.bgmusic.playbackRate = 1;
			}, 1000);
			console.log('zone',(performance.now() - ZONECLICKS[0]) / 10,ZONECLICKS[0])
		}
	}
}


function drawActionButton (action, x, y, enabled) {
	let isHovered = (Mouse.x > x && Mouse.x < x+63 && Mouse.y > y && Mouse.y < y+20) || false;
	let isPressed = (isHovered && Mouse.pressed) || false;

	let PYO = isPressed?2:0; //isPressed Offset
	let IXO = Math.min(9, (action=='Feed'?GAME.upgrades.food:(action=='Train'?GAME.upgrades.equiptment:GAME.upgrades.shelter))-1) * 18; //icon X Offset 
	let IYO = action=='Feed'?0:(action=='Train'?14:28); //icon Y Offset 

	if (enabled && !SLEEP.ing) {
		if (isHovered) CTX.drawImage(IMAGE['ui'],0,isPressed?40:0,63,20,x,y,63,20);

		//icon
		if (GAME.tutorial == 0 && action == 'Hatch') CTX.drawImage(IMAGE['pets'], GAME.pet.spriteX,GAME.pet.id*64, 8,8, 146,42 + PYO, 8,8);
		//else CTX.drawImage(IMAGE['ui'],198,126+IYO,18,14,y+5,x+1+PYO,18,14);
		else CTX.drawImage(IMAGE['ui'],198+IXO,126+IYO,18,14,x+3,y+2+PYO,18,14);

		//text
		CTX.fillText(action, x+40, y+12+PYO, '#8ab138', 'center');//shadow
		CTX.fillText(action, x+40, y+11+PYO, '#ffffff', 'center');

	} else {
		CTX.drawImage(IMAGE['ui'],0,20,63,20,x,y,63,20);
		CTX.fillText(action, x+40, y+13, '#3e424d', 'center');

		//icon 
		CTX.drawImage(IMAGE['ui'],198+182+IXO,126+IYO,18,14,x+3,y+4,18,14);
	}
}

function drawUpgradeButton (stat, x, y) {
	let isHovered = (Mouse.x > x && Mouse.x < x+37 && Mouse.y > y && Mouse.y < y+18) || false;
	let isPressed = (isHovered && Mouse.pressed) || false;

	//can afford
	if (GAME.money >= GAME.upgradeCost[stat]) {
		//hover bg
		if (isHovered) CTX.drawImage(IMAGE['ui'],63,isPressed?40:0,37,18,x,y,37,18);
	
		//text
		CTX.fillText('$'+GAME.upgradeCostDisplay[stat], x+24, 119 + (isPressed?2:0), '#8ab138', 'center');
		CTX.fillText('$'+GAME.upgradeCostDisplay[stat], x+24, 118 + (isPressed?2:0), '#ffffff', 'center');
	} else {
		CTX.drawImage(IMAGE['ui'],63,20,37,18,x,y,37,18);
		CTX.fillText('$'+GAME.upgradeCostDisplay[stat], x+24, 121, '#3e424d', 'center');
	}
}

const ZONECLICKS = [];

function calcZoneMultiplier (zone = GAME.zone) {
	let multiplier = ((Math.ceil((200-zone)/10)/5)+1);
	//console.log('zone multiplier',multiplier);
	return Math.max(1,multiplier);
}