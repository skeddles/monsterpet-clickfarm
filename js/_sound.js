SOUND.play = function (soundName) {

	let sound = SOUND[soundName];

	if (!sound) return console.error(
		'sound','"'+soundName+'"', 'not found');

	//stop the background music
	//SOUND.bg1.pause();
		
	//reset sound position
	sound.currentTime = 0; 

	sound.volume = GAME.settings.sound; 

	//play the requested sound
	if (sound.volume > 0) sound.play();

	console.info('playing sound', sound,sound.volume);
};