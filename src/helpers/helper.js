const axios = require("axios");
const endPoint = `https://staff-service.herokuapp.com`;
//const endPointTest = `http://10.0.0.223:3000`;

async function getUserInfo(computer_name) {
	let value = {};
	try {
		const employeeDetails = await axios.get(`${endPoint}/api/v1/users/getStaffByCompName/${computer_name}`);
		value = employeeDetails.data.data;
	} catch (err) {
		console.log(err);
	}
	return value;
}

async function userSignIn(fd) {
	let value = {};
	try {
		const details = await axios.post(`${endPoint}/api/v1/users/signIn/`, fd);
		value = details.data;
	} catch (err) {
		console.log(err);
	}
	return value;
}

module.exports = { getUserInfo, userSignIn };
