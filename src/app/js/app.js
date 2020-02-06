const { ipcRenderer } = require("electron");
const { getUserInfo, userSignIn } = require("../../helpers/helper");
const username = require("username");
const fullname = require("fullname");
const mysql = require("mysql");
var conn = mysql.createPool({
	host: "agusto40.com",
	user: "agusto40_DevUser",
	password: "DevUser@2020",
	database: "agusto40_applist"
});

console.log(conn["_allConnections"]);

new Vue({
	el: "#app",
	data: {
		userDetails: [],
		appList: [],
		username: "",
		firstName: "",
		lastName: "",
		department: "",
		profilePic: "",
		Loaded: false
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
				this.userDetails = res;
				this.firstName = res.firstname;
				this.lastName = res.lastname;
				this.profilePic = res.image;
				this.department = res.unit;
				this.getList(res.isAdmin, this.department);
			});
		},

		getList(isAdmin, dept) {
			let this2 = this;
			conn.query("SELECT * from apps WHERE status='true'", [], (err, result) => {
				if (err) return;
				isAdmin == 1 ? (this2.appList = result) : (this2.appList = result.filter(el => el.dept.includes(dept) || el.dept.includes("all")));
				this2.Loaded = true;
			});
		},

		openList() {
			ipcRenderer.send("openList");
		},

		hideList() {
			ipcRenderer.send("hideList");
		},

		async openApp(el) {
			this.Loaded = false;
			let url = "";

			let userDetails = this.userDetails;
			const signIn = {
				corporate_email: userDetails.corporate_email,
				password: `${userDetails.computer_name}${userDetails.employee_id}`
			};
			let data = await userSignIn(signIn);
			status = data.status;

			status == 200 ? (url = `${el.url}?details=${btoa(JSON.stringify(userDetails))}`) : (url = el.url);
			this.Loaded = true;
			ipcRenderer.send("openApp", url);
		}
	}
});
