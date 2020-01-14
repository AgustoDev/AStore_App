const { ipcRenderer } = require("electron");
const { getUserInfo } = require("../../helpers/helper");
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
		username: "",
		firstName: "",
		lastName: "",
		department: "",
		profilePic: ""
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
			getUserInfo(name).then(res => {
				this.firstName = res.firstname;
				this.lastName = res.lastname;
				this.profilePic = res.image;
				this.department = res.unit;
				this.getList(res.isAdmin, this.department);
			});
		},
		getList(isAdmin, dept) {
			console.log(dept);
			let this2 = this;
			conn.query("SELECT * from applist WHERE status='true'", [], (err, result) => {
				if (err) return;
				console.log(result);
				isAdmin == 1 ? (this2.appList = result) : (this2.appList = result.filter(el => el.dept.includes(dept) || el.dept.includes("all")));
				console.log(this2.appList);
			});
		},
		openList() {
			ipcRenderer.send("openList");
		},

		hideList() {
			ipcRenderer.send("hideList");
		},

		openApp(el) {
			let url = el.url;
			let icon = el.favicon;
			let id = el.id;

			let name = this.username;
			name !== "" ? (name = name.toLowerCase()) : (name = "");
			ipcRenderer.send("openApp", { url, icon, name, id });
		}
	}
});
