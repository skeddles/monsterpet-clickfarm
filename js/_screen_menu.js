var menuScreen = {
	draw: (delta) => {
		CTX.drawImage(IMAGE['menu'], 0, 0);

		drawButton('   Back', '#0e3c8f', 517, 35, 18, 1, -1);

		drawButton('twitter', '#6b2222', 552, 52, 20, 100, 61);
		drawButton('instagram', '#6b2222', 552, 52, 20, 156, 61);

		drawButton(GAME.settings.music==0?'unmute':'mute', '#063a90', 302, 45, 20, 100, 10);

		drawButton(GAME.settings.sound==0?'unmute':'mute', '#063a90', 302, 45, 20, 196, 10);

	},
	click: (e) => {
		//exit
		if (between(1, -1,35,18)) return GAME.screen = 'main';

		//social links
		if (between(100, 61,52, 20)) window.open('https://twitter.com/skeddles', '_blank');
		if (between(156, 61,52, 20)) window.open('https://instagram.com/skeddles', '_blank');

		//sound muting
		if (between(100, 10,45, 20)) {
			GAME.settings.music = (GAME.settings.music==0?0.4:0);
			SOUND.bgmusic.volume = GAME.settings.music;
			SOUND["tutorial_complete"].volume = GAME.settings.music;
		}

		if (between(196, 10,45, 20)) {
			GAME.settings.sound = (GAME.settings.sound==0?1:0);
		}
	}
}