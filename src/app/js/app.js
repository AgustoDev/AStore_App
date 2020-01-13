const { ipcRenderer } = require("electron");
const getUserInfo = require("../../helpers/helper");
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
        this.init();
        setInterval(() => this.init(), 120000);
    },
    methods: {
        init() {
            (async () => {
                var name = await username();
                this.username = name.toUpperCase();
                this.validatesUser(name);
            })();
        },

        validatesUser(name) {
            getUserInfo("chijioke").then(res => {
                var dept = res.unit;
                this.getList(dept);
            });
        },
        getList(dept) {
            let this2 = this;
            conn.query("SELECT * from applist WHERE status='true'", [], (err, result) => {
                if (err) return;

                dept == "Executive Office" ? (this2.appList = result) : (this2.appList = result.filter(el => el.dept == dept || el.dept == "all"));
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
