const { autoUpdater } = require("electron-updater");
autoUpdater.logger = require("electron-log");
autoUpdater.logger.transports.file.level = "info";

exports.check = () => {
    // Start Update Check . . . .
    autoUpdater.setFeedURL({
        provider: "github",
        owner: "AgustoDev",
        repo: "AStore_App",
        token: "b387d433f67af7da5d28f26a0a68f0f4c9a2e9d6"
    });
    autoUpdater.checkForUpdates();
};
