var IMAGESTOLOAD = 'bg,ui,pets,intro,arena,tutorial,menu'.split(',');
var SOUNDSTOLOAD = 'upgrade,levelup,xp1,xp2,xp3,xp4,xp5,xp6,xp7,eat,bgmusic,arena_win,arena_lose,hit,tutorial_complete'.split(',');

const IMAGE = {};
const SOUND = {};


function loadFiles(callback,index) {
	index=index||0;
	//load images
	if (index < IMAGESTOLOAD.length) {
		console.info('loading image',IMAGESTOLOAD[index]); 
		let img = new Image();
		img.src = 'images/'+ IMAGESTOLOAD[index] +'.png';
		IMAGE[IMAGESTOLOAD[index]] = img;
		IMAGESTOLOAD[index] = img;
		IMAGESTOLOAD[index].onload = function() { 
			console.log('image',IMAGESTOLOAD[index],'loaded');
			loadFiles(callback, ++index);
		};
		IMAGESTOLOAD[index].onerror = function() {
			console.error('image',IMAGESTOLOAD[index],'failed to load');
			loadFiles(callback, ++index);
		};
	} 
	else if (index < IMAGESTOLOAD.length + SOUNDSTOLOAD.length) {
		let soundIndex = index - IMAGESTOLOAD.length;	
		let sound = SOUNDSTOLOAD[soundIndex];
		console.info('loading sound',sound);
		let el = document.createElement("audio");
		el.src = ''+sound+'.ogg';
		el.setAttribute("preload", "auto");
		el.setAttribute("controls", "none");
		el.style.display = "none";
		document.body.appendChild(el);
		SOUND[SOUNDSTOLOAD[soundIndex]] = el;

		//load next file
		el.oncanplaythrough = function ready () {
			if (this.loaded) return;
			console.log('sound',SOUNDSTOLOAD[soundIndex],'loaded');
			this.loaded = true;
			loadFiles(callback, ++index);
		};
		el.onerror = function() {
			console.error('sound',SOUNDSTOLOAD[soundIndex],'failed to load');
			loadFiles(callback, ++index);
		};
		console.info('loading sound el',el);
		
	}
	else if (index < IMAGESTOLOAD.length + SOUNDSTOLOAD.length + 1) {
		document.fonts.load('8px mainfont').then(e=>{
			console.log('font mainfont loaded');
			loadFiles(callback, ++index);
		});
	}
	else {
		console.log('loaded files',IMAGESTOLOAD, SOUNDSTOLOAD);
		delete IMAGESTOLOAD;
		delete SOUNDSTOLOAD;
		callback();
	}
}

let LOADING = true;

//when page is loaded
window.onload = function() {
	console.log('page loaded');
	resizeWindow();

	//start by loading the loading text image
	let img = new Image();
	img.src = 'images/loading.png';
	img.onload = function() {

		CTX.fillStyle = '#1b1b1b';
		CTX.fillRect(0, 0, CANVAS.width, CANVAS.height);
		CTX.drawImage(img, Math.floor(W/2)-75, Math.floor(H/2)-11);

		loadFiles(() => {
			resizeWindow();
			LOADING = false;
			CTX.fillRect(0, 0, CANVAS.width, CANVAS.height);
			CTX.fillText('Click to Start!', Math.floor(W/2), Math.floor(H/2), '#6c6c6c', 'center');
		});
	};
}

function startGame () {
	console.log('clicked start game, loading:', LOADING);
	if (LOADING) return;

	resizeWindow();

	//Load save data
	let loadedSaveData = localStorage.getItem('monsterclickfarm');
	if(loadedSaveData && loadedSaveData.length > 20) {
		console.log('LOADING - loaded save data', loadedSaveData,loadedSaveData !== 'null',loadedSaveData.length)
		Object.assign(GAME, JSON.parse(loadedSaveData));
		GAME.screen = 'main';
		GAME.pet.x = 60;
		GAME.pet.y = 28;
		GAME.zone = 201;
	}
	else console.log('LOADING - starting new game')


	//prepare  music
	SOUND.bgmusic.loop = true;
	SOUND.bgmusic.volume = GAME.settings.music;
	SOUND.bgmusic.play();
	SOUND["tutorial_complete"].volume = GAME.settings.music;
	
	//make bg music resume when arena tunes finish
	SOUND['arena_win'].onended = () => {SOUND.bgmusic.play()};
	SOUND['arena_lose'].onended = () => {SOUND.bgmusic.play()};

	//remove the start game click handler
	document.body.removeEventListener('click', startGame);

	//start game update loop
	window.requestAnimationFrame(update);
}
document.body.addEventListener('click', startGame);

var lastSave = 0;
function saveGame () {
	//return;
	if (LOADING) return;
	if (GAME.screen == 'intro') return;
	if (GAME.pet.level < 1) return;
	localStorage.setItem('monsterclickfarm',JSON.stringify(GAME));
	console.log('game saved')
}
setInterval(saveGame, 10000);

function eraseSave() {
	if (!confirm('Are you sure you want to erase all of your save data? Your monster will have a happy life in a faraway forest. You will never see your monster again.')) return;

	localStorage.setItem('monsterclickfarm',null);
	location.reload(); 
}
document.addEventListener('keyup', e=> {
	if (e.code == 'KeyE' && e.ctrlKey && e.altKey && e.shiftKey) eraseSave();
});


