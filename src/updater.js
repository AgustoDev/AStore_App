const { dialog, BrowserWindow, ipcMain } = require("electron");
const { autoUpdater } = require("electron-updater");
autoUpdater.logger = require("electron-log");
autoUpdater.logger.transports.file.level = "info";

exports.check = () => {
	// Start Update Check . . . .
	let downloadProgress = 0;
	autoUpdater.autoDownload = false;
	autoUpdater.checkForUpdates();
	autoUpdater.on("update-available", () => {
		dialog.showMessageBox(
			{
				type: "info",
				title: "Update Available",
				message: "A new version of this app is available. Do you want to update now ?",
				buttons: ["Update", "No"]
			},
			btnIndex => {
				if (btnIndex !== 0) return;
				autoUpdater.downloadUpdate();

				let progressWin = new BrowserWindow({
					width: 350,
					height: 35,
					useContentSize: true,
					autoHideMenuBar: true,
					resizable: false,
					fullscreen: false,
					maximizable: false
				});

				progressWin.loadURL(__dirname + "/app/progress.html");
				progressWin.on("closed", () => (progressWin = null));
				ipcMain.on("downloadProgressRequest", e => {
					e.returnValue = downloadProgress;
				});

				autoUpdater.on("download-progress", d => {
					downloadProgress = d.percent;
				});

				autoUpdater.on("update-downloaded", () => {
					if (progressWin) progressWin.close();
					dialog.showMessageBox(
						{
							type: "info",
							title: "Update Ready",
							message: "A new version of this app is ready for install. Quit  and install?",
							buttons: ["Yes", "No"]
						},
						btnIndex => {
							if (btnIndex == 0) autoUpdater.quitAndInstall();
						}
					);
				});
			}
		);
	});
};
