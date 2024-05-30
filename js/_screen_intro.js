

var introScreen = {
	draw: (delta) => {
		CTX.drawImage(IMAGE['intro'], 0, 0);

		drawButton('Red', '#6b2222', 212, 45, 20, 27, 99);
		drawButton('Green', '#226728', 257, 45, 20, 105, 99);
		drawButton('Blue', '#063a90', 302, 45, 20, 185, 99);
	},
	click: (e) => {
		//buttons
		if (between(27, 99,45,20)) buyEgg('red');
		if (between(105, 99,45,20)) buyEgg('green');
		if (between(185, 99,45,20)) buyEgg('blue');
	}
}

var randomPetName = arandom(['Pookie','Fido','Crayon','Dulcy','Rocky', 'Princess']);

function buyEgg (eggColor) {
	if (eggColor == 'red')
		GAME.pet.id = 0;
	if (eggColor == 'green')
		GAME.pet.id = 1;
	if (eggColor == 'blue')
		GAME.pet.id = 2;


	//log user agent
	console.log(navigator.userAgent)
	//if user agent includes "electron"
	if (navigator.userAgent.includes('Electron')) {
		//prompt for pet name
		electronPrompt('What would you like to name your pet?', (name) => {
			GAME.pet.name = name || randomPetName
			GAME.screen = 'main';
		});
	} else {
		//prompt for pet name
		GAME.pet.name = prompt('What would you like to name your pet?') || randomPetName
		GAME.screen = 'main';
	}	
}