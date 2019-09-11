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
        this.getList();
        setInterval(() => this.getList(), 120000);

        (async () => {
            var name = await username();
            this.username = name.toUpperCase();
        })();
    },
    methods: {
        getList() {
            let this2 = this;
            conn.query("SELECT * from applist WHERE status='true'", [], (err, result) => {
                if (err) {
                    return;
                }
                this2.appList = result;
            });
        },
        openList() {
            ipcRenderer.send("openList");
        },

        hideList() {
            ipcRenderer.send("hideList");
        },

        openApp(url, icon) {
            let name = this.username;
            name !== "" ? (name = name.toLowerCase()) : (name = "");
            ipcRenderer.send("openApp", { url, icon, name });
        }
    }
});
