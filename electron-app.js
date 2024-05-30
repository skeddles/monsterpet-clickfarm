const electron = require('electron');
const { app, BrowserWindow } = electron;

let mainWindow;

app.on('ready', () => {
    mainWindow = new BrowserWindow({
        width: 768,
        height: 384,
		minHeight: 128,
		minWidth: 256,
		autoHideMenuBar: true,
    });

	mainWindow.setMenu(null)
	
    mainWindow.setTitle('Monsterpet Clickfarm');
    mainWindow.loadFile('build/index.html');

    mainWindow.on('closed', () => {
		console.log('closed');
        mainWindow = null;
    });

	mainWindow.webContents.setWindowOpenHandler(({ url }) => {
		electron.shell.openExternal(url);
		return { action: 'deny' };
	});

	//mainWindow.webContents.openDevTools();
});