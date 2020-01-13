const axios = require("axios");
const sgMail = require("@sendgrid/mail");
const config = require("../config/secret");

async function getUserInfo(computer_name) {
    let value = {};
    try {
        const employeeDetails = await axios.get(`http://10.0.0.223:3000/api/v1/users/getStaffByCompName/${computer_name}`);
        console.log(employeeDetails.data);
        value = employeeDetails.data.data;
        console.log(value);
    } catch (err) {
        console.log(err);
    }
    return value;
}

async function sendEmail(to, from, subject, html) {
    sgMail.setApiKey(config.SendgridKey);
    const mail = {
        to,
        from,
        subject,
        text: html.replace(/<[^>]*>?/gm, ""),
        html
    };
    var res = await sgMail.send(mail);
    return res;
}

module.exports = { getUserInfo, sendEmail };
