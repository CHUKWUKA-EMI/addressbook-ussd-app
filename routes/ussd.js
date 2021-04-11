const express = require("express");
const firebase = require("../utils/firebase");

const router = express.Router();

router.post("/", async (req, res) => {
	// Read variables sent via POST from our SDK
	const { text } = req.body;

	let response = "";
	let textValue = text.split("*").length;

	if (text === "") {
		// This is the first request. Note how we start the response with CON
		response = `CON What would you like to do
        1. View a list of contacts
        2. Add a new contact`;
	} else if (text === "1") {
		// Business logic for first level response
		const addrr = [];
		const addressRef = firebase.database().ref("Address-Book");
		await addressRef.once("value", (snapshot) => {
			const addresses = snapshot.val();

			for (let id in addresses) {
				addrr.push({ id, ...addresses[id] });
			}
		});
		response = `END Your contacts are ${
			addrr.length > 0
				? `<ol>${addrr.map(
						(addr) => `<li>${addr.name}  ${addr.phoneNumber}</li>`
				  )}</ol>`
				: "No data"
		}`;
	} else if (text === "2") {
		// Business logic for first level response
		response = `CON What is the name of the contact`;
	} else if (textValue === 2) {
		// This is a second level response where the user selected 2
		response = `CON What is the Phone number of the contact`;
	} else if (textValue === 3) {
		// This is a second level response where the user selected 2
		response = `CON What is the Email address of the contact`;
	} else if (textValue === 4) {
		const name = text.split("*")[1];
		const phone = text.split("*")[2];
		const email = text.split("*")[3];
		const data = {
			name: name,
			phoneNumber: phone,
			emailAddress: email,
		};
		const addressRef = firebase.database().ref("Address-Book");
		const add = await addressRef.push(data);
		if (add) {
			response = `END You have successfully added a contact to your Address Book`;
		}
	}

	// Print the response onto the page so that our SDK can read it
	res.set("Content-Type: text/plain");
	res.send(response);
	// DONE!!!
});

module.exports = router;
