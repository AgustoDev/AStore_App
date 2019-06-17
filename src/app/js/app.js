const { ipcRenderer } = require("electron");
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
    appList: []
  },
  mounted() {
    let this2 = this;
    conn.query("SELECT * from applist", [], (err, result) => {
      console.log(err);
      this2.appList = result;
    });
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
