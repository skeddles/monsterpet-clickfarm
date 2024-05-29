

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

function buyEgg (eggColor) {
	if (eggColor == 'red')
		GAME.pet.id = 0;
	if (eggColor == 'green')
		GAME.pet.id = 1;
	if (eggColor == 'blue')
		GAME.pet.id = 2;

	GAME.pet.name = prompt('What would you like to name your pet?') || arandom(['Pookie','Fido','Crayon','Dulcy','Rocky', 'Princess'])

	GAME.screen = 'main';
}