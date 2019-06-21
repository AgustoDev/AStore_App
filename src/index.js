const electron = require("electron");
const { ipcMain, Tray } = require("electron");
const path = require("path");
const app = electron.app;
const BrowserWindow = electron.BrowserWindow;
var iconpath = path.join(__dirname, "icon.ico");
const updater = require("./updater");

//require("electron-reload")(__dirname);

let listWindow = null;
app.on("ready", () => {
    /*--------------------Circle Window ------------------------*/
    let display = electron.screen.getPrimaryDisplay();
    let width = display.bounds.width;
    let height = display.bounds.height;

    var mainWindow = new BrowserWindow({
        width: 65,
        height: 65,
        x: width - 10 - 75,
        y: height - 50 - 75,
        frame: false,
        transparent: true,
        icon: "./src/app/icon.svg",
        resizable: false,
        webPreferences: {
            nodeIntegration: true
        }
    });
    mainWindow.loadURL(__dirname + "/app/main.html");
    mainWindow.setSkipTaskbar(true);
    //mainWindow.openDevTools();

    setTimeout(updater.check, 2000);

    /*--------------------List Window ------------------------*/
    listWindow = new BrowserWindow({
        width: 300,
        height: 300,
        maxHeight: 300,
        x: width - 5 - 300,
        y: height - 40 - 300,
        show: false,
        transparent: true,
        frame: false,
        resizable: false,
        webPreferences: {
            nodeIntegration: true
        }
    });
    listWindow.loadURL(__dirname + "/app/list.html");
    listWindow.setSkipTaskbar(true);
    //listWindow.openDevTools();

    /*--------------------App Window ------------------------*/
    appWindow = new BrowserWindow({
        center: true,
        show: false,
        x: width - 5,
        minWidth: width - 500,
        minHeight: height - 200,
        width,
        height,
        autoHideMenuBar: true,
        webPreferences: {
            nodeIntegration: true
        }
    });

    appWindow.on("close", e => {
        e.preventDefault();
        appWindow.loadURL(__dirname + "/app/blank.html");
        appWindow.hide();
    });

    ipcMain.on("openList", () => {
        listWindow.show();
    });

    ipcMain.on("openApp", (value, url) => {
        appWindow.loadURL(url);
        appWindow.setSkipTaskbar(true);
        appWindow.show();
        appWindow.maximize();
    });

    ipcMain.on("hideList", () => {
        listWindow.hide();
    });
});

app.on("closed", () => {
    listWindow = null;
});
