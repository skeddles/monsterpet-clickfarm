
const GRAVITY = 0.1;
const BOUNCE = 0.8;
var Particles = [];


function renderParticles (delta) {
	let pixels = CTX.getImageData(0,0,256,128);

	//loop through all particles
	Particles.forEach((p,i,a) => {

		//killcheck
		if (p.position.y > 130 || p.age > p.lifespan) {
			a.splice(i,1);
			return;
		}

		p.age ++;
		p.position.x += p.velocity.x;
		p.position.y += p.velocity.y;
		p.velocity.y += p.gravity;

		if (p.position.y > p.bouncey) p.velocity.y = BOUNCE * Math.abs(p.velocity.y) * -1;

		if (p.shape == 'confetti') drawConfetti(p);
		else if (p.shape == 'big') drawBig(p);
		else if (p.shape == 'number') drawTinyNumber(p);
		else if (p.shape == 'z') drawZ(p);
		//pixel
		else CTX.fillRectColor(p.color,round(p.position.x),round(p.position.y),1,1);
	});
}


function particleBurst(options = {}) {
	if (!options.amount) options.amount = 20;

	for (var i = 0; i < options.amount; i++) {
		let lifespan = typeof options.life == 'number'?options.life:100;
		if (typeof options.life == 'object') {
			let min = options.life.min || 50;
			let max = options.life.max || 100;
			lifespan = min + Math.random()*(max-min);
		}

		Particles.push({
			color: options.color || 'white',
			shape: options.shape == 'halfbig'? (brandom()?'big':null) : options.shape,
			age: 0,
			lifespan: lifespan,
			position: {
				x: options?.position?.x || 128, 
				y: options?.position?.y || 64 	},
			velocity: {
				x: (Math.random() *2 -1) * (options?.velocity?.x || 1), 
				y: (Math.random() *2 -3) * (options?.velocity?.y || 1)		},
			bouncey: options.bouncey || 9999,
			gravity: options.gravity || GRAVITY,
			text: options.text || 0,
		});
	}
}

function drawBig (p) {
	CTX.fillRectColor(p.color,round(p.position.x),round(p.position.y),1,1);
	CTX.fillRectColor(p.color,round(p.position.x+1),round(p.position.y),1,1);
	CTX.fillRectColor(p.color,round(p.position.x),round(p.position.y+1),1,1);
	CTX.fillRectColor(p.color,round(p.position.x+1),round(p.position.y+1),1,1);
}

function drawConfetti (p) {
	let frame = Math.floor(performance.now()/500 * 2)%2==0;
	console.log(frame)

	if (!p.rotation) p.rotation = round(Math.random()*3);

	if (p.age%10==0 && Math.random()>0.95) p.rotation++;
	else if (p.age%10==0 && Math.random()>0.05) p.rotation--;
	if (p.rotation < 0) p.rotation = 3;
	if (p.rotation > 3) p.rotation = 0;

	if (p.age%10==5) p.position.x -= round(Math.random()*2) -1

	switch (p.rotation) {
		//horizontal
		case 0:
			CTX.fillRectColor(p.color,round(p.position.x-1),round(p.position.y),1,1);
			CTX.fillRectColor(p.color,round(p.position.x),round(p.position.y),1,1);
			CTX.fillRectColor(p.color,round(p.position.x+1),round(p.position.y),1,1);
			
			if (frame) {
				CTX.fillRectColor(p.color,round(p.position.x-1),round(p.position.y+1),1,1);
				CTX.fillRectColor(p.color,round(p.position.x),round(p.position.y+1),1,1);
				CTX.fillRectColor(p.color,round(p.position.x+1),round(p.position.y+1),1,1);
			} 
			break;

		//right diagonal
		case 1:
			CTX.fillRectColor(p.color,round(p.position.x+1),round(p.position.y-1),1,1);
			CTX.fillRectColor(p.color,round(p.position.x),round(p.position.y),1,1);
			CTX.fillRectColor(p.color,round(p.position.x-1),round(p.position.y+1),1,1);

			if (frame) {
				CTX.fillRectColor(p.color,round(p.position.x-1),round(p.position.y),1,1);
				CTX.fillRectColor(p.color,round(p.position.x+1),round(p.position.y),1,1);
				CTX.fillRectColor(p.color,round(p.position.x),round(p.position.y-1),1,1);
				CTX.fillRectColor(p.color,round(p.position.x),round(p.position.y+1),1,1);
			} 
			break;
		//vertical
		case 2:
			CTX.fillRectColor(p.color,round(p.position.x),round(p.position.y-1),1,1);
			CTX.fillRectColor(p.color,round(p.position.x),round(p.position.y),1,1);
			CTX.fillRectColor(p.color,round(p.position.x),round(p.position.y+1),1,1);

			if (frame) {
				CTX.fillRectColor(p.color,round(p.position.x+1),round(p.position.y-1),1,1);
				CTX.fillRectColor(p.color,round(p.position.x+1),round(p.position.y),1,1);
				CTX.fillRectColor(p.color,round(p.position.x+1),round(p.position.y+1),1,1);
			} 
			break;
		//left diagonal
		case 3:
			CTX.fillRectColor(p.color,round(p.position.x-1),round(p.position.y-1),1,1);
			CTX.fillRectColor(p.color,round(p.position.x),round(p.position.y),1,1);
			CTX.fillRectColor(p.color,round(p.position.x+1),round(p.position.y+1),1,1);

			if (frame) {
				CTX.fillRectColor(p.color,round(p.position.x-1),round(p.position.y),1,1);
				CTX.fillRectColor(p.color,round(p.position.x+1),round(p.position.y),1,1);
				CTX.fillRectColor(p.color,round(p.position.x),round(p.position.y-1),1,1);
				CTX.fillRectColor(p.color,round(p.position.x),round(p.position.y+1),1,1);
			} 
			break;
	}
}


const NUMBER = [
	/*0*/'010101101010',
	/*1*/'11010101',
	/*2*/'10011011',
	/*3*/'110011001110',
	/*4*/'101101111001',
	/*5*/'111110001110',
	/*6*/'011100111011',
	/*7*/'111001010010',
	/*8*/'0110101001010110',
	/*9*/'011101011001',
].map(n => n.split('').map(d=>d==1));

function drawTinyNumber(p) {
	let textNumber = String(p.text);
	let xOffset = 0;
	let negative = false;
	if (textNumber[0] == '-') {
		negative = true;
		textNumber = textNumber.slice(1);
	}
	
	//draw number shadow
	if (p.shadowColor) {
		CTX.fillStyle = p.shadowColor;
		if (negative) {
			CTX.fillRect(round(p.position.x)-1,round(p.position.y)+2, 1, 1 );
			CTX.fillRect(round(p.position.x)-2,round(p.position.y)+2, 1, 1 );
		}
		for (let digit = 0; digit < textNumber.length; digit++) {
			let number = NUMBER[textNumber[digit]];
			let digitWidth = number.length/4;
			number.forEach((px,i) => {
				if (px) CTX.fillRect(round(p.position.x+1)+xOffset+i%digitWidth,round(p.position.y+1)+Math.floor(i/digitWidth), 1, 1 );
			});
			xOffset += digitWidth+1;
		}
	}


	//draw normal number
	xOffset = 0;
	CTX.fillStyle = p.color;
	if (negative) {
		CTX.fillRect(round(p.position.x)-2,round(p.position.y)+1, 1, 1 );
		CTX.fillRect(round(p.position.x)-3,round(p.position.y)+1, 1, 1 );
	}
	for (let digit = 0; digit < textNumber.length; digit++) {
		let number = NUMBER[textNumber[digit]];
		let digitWidth = number.length/4;
		number.forEach((px,i) => {
			if (px) CTX.fillRect(round(p.position.x)+xOffset+i%digitWidth,round(p.position.y)+Math.floor(i/digitWidth), 1, 1 );
		});
		xOffset += digitWidth+1;
	}
}

function drawZ (p) {
	CTX.fillStyle = p.color;
	let x = round(p.position.x);
	let y = round(p.position.y);
	if (p.age%10==5) p.position.x -= round(Math.random()*2) -1

	CTX.fillRect(x-1,y-1, 1, 1 );
	CTX.fillRect(x,y-1, 1, 1 );
	CTX.fillRect(x+1,y-1, 1, 1 );
	CTX.fillRect(x+2,y-1, 1, 1 );
	
	CTX.fillRect(x+1,y, 1, 1 );
	CTX.fillRect(x,y+1, 1, 1 );

	CTX.fillRect(x-1,round(p.position.y+3)-1, 1, 1 );
	CTX.fillRect(x,round(p.position.y+3)-1, 1, 1 );
	CTX.fillRect(x+1,round(p.position.y+3)-1, 1, 1 );
	CTX.fillRect(x+2,round(p.position.y+3)-1, 1, 1 );
}