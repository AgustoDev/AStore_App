const { ipcRenderer } = require("electron");
const username = require("username");
const fullname = require("fullname");
const mysql = require("mysql");
var conn = mysql.createPool({
    host: "10.0.0.223",
    user: "root",
    password: "DevUser",
    database: "appcenter"
});

new Vue({
    el: "#app",
    data: {
        appList: [],
        username: ""
    },
    mounted() {
        let this2 = this;
        conn.query("SELECT * from applist", [], (err, result) => {
            this2.appList = result;
        });

        (async () => {
            var name = await username();
            this.username = name.toUpperCase();
        })();
    },
    methods: {
        openList() {
            ipcRenderer.send("openList");
        },

        hideList() {
            ipcRenderer.send("hideList");
        },

        openApp(url) {
            ipcRenderer.send("openApp", url);
        }
    }
});
