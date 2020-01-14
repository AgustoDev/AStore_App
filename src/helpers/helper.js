const axios = require("axios");
async function getUserInfo(computer_name) {
	let value = {};
	try {
		const employeeDetails = await axios.get(`http://10.0.0.223:3000/api/v1/users/getStaffByCompName/${computer_name}`);
		value = employeeDetails.data.data;
	} catch (err) {
		console.log(err);
	}
	return value;
}

module.exports = { getUserInfo };
