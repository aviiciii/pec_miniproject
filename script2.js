// add event listener for document loaded
document.addEventListener("DOMContentLoaded", function (event) {
	const base_url = "https://pechacksqr.azurewebsites.net";


	console.log("DOM fully loaded and parsed");

	const params = new Proxy(new URLSearchParams(window.location.search), {
		get: (searchParams, prop) => searchParams.get(prop),
	});
	// Get the value of "some_key" in eg "https://example.com/?some_key=some_value"
	let teamcode = params.code;

	console.log(teamcode);

	// add cors header to api response
	const cors_header = new Headers({
		"Access-Control-Allow-Origin": "*",
		"Access-Control-Allow-Methods": "GET, POST, PATCH, PUT, DELETE, OPTIONS",
		"Access-Control-Allow-Headers": "Origin, Content-Type, X-Auth-Token",
		"Content-type": "application/json",
		Accept: "application/json",
	});

	// get team name and member names
	var team_id = document.getElementById("team-id");
	var team_name = document.getElementById("team-name");
	var team_accomodation = document.getElementById("team-accomodation");
	var team_arrival = document.getElementById("team-arrival");
	var team_departure = document.getElementById("team-departure");
	var college = document.getElementById("team-college");
	var city = document.getElementById("team-city");
	var state = document.getElementById("team-state");
	var room = document.getElementById("team-room");




	var tl = document.getElementById("tl-name");
	var m1 = document.getElementById("m1-name");
	var m2 = document.getElementById("m2-name");
	var m3 = document.getElementById("m3-name");
	var m4 = document.getElementById("m4-name");

	// emails
	var tl_email = document.getElementById("tl-email");
	var m1_email = document.getElementById("m1-email");
	var m2_email = document.getElementById("m2-email");
	var m3_email = document.getElementById("m3-email");
	var m4_email = document.getElementById("m4-email");

	// contact numbers
	var tl_contact = document.getElementById("tl-contact");
	var m1_contact = document.getElementById("m1-contact");
	var m2_contact = document.getElementById("m2-contact");
	var m3_contact = document.getElementById("m3-contact");
	var m4_contact = document.getElementById("m4-contact");

	// get the checkboxes
	var check1 = document.getElementById("tl-checkbox");
	var check2 = document.getElementById("m1-checkbox");
	var check3 = document.getElementById("m2-checkbox");
	var check4 = document.getElementById("m3-checkbox");
	var check5 = document.getElementById("m4-checkbox");

	// get check in button
	var check_in_button = document.getElementById("check-in-button");

	var url = base_url + "/teamdetails/" + teamcode;
	console.log(url);
	console.log(cors_header);

	// get team details from api
	fetch(url, {
		method: "GET",
		mode: "cors",
		headers: cors_header,
	})
		.then((response) => response.json())
		.then((data) => {
			console.log(data);
			if (data["status"] == "failure") {
				console.log("Team not found");
				alert("Team not found");
				window.location.href = "/index.html";
			}

			team_id.innerHTML = data["Team ID"];
			team_name.innerHTML = data["Team Name"];
			// tick if accomodation is yes, cross if no

			if (data["Accomodation"] == "Yes") {
				team_accomodation.innerHTML = "✅";
			} else {
				team_accomodation.innerHTML = "❌";
			}
			team_arrival.innerHTML = data["Arrival"];
			team_departure.innerHTML = data["Departure"];
			college.innerHTML = data["College"];
			city.innerHTML = data["City"];
			state.innerHTML = data["State"];
			room.innerHTML = data["Room Number"];
			if (data["Room Number"] === "nan") {
				room.innerHTML = "-";
			}


			tl.innerHTML = data["TL"].trim();
			m1.innerHTML = data["M1"].trim();
			m2.innerHTML = data["M2"].trim();
			m3.innerHTML = data["M3"].trim();
			m4.innerHTML = data["M4"].trim();

			tl_email.innerHTML = data["TL Email"].trim();
			m1_email.innerHTML = data["M1 Email"].trim();
			m2_email.innerHTML = data["M2 Email"].trim();
			m3_email.innerHTML = data["M3 Email"].trim();
			m4_email.innerHTML = data["M4 Email"].trim();

			tl_contact.innerHTML = data["TL Phone"].trim();
			m1_contact.innerHTML = data["M1 Phone"].trim();
			m2_contact.innerHTML = data["M2 Phone"].trim();
			m3_contact.innerHTML = data["M3 Phone"].trim();
			m4_contact.innerHTML = data["M4 Phone"].trim();


			if (data["M1"].trim() == "") {
				m1.innerHTML = "-";
				m1_email.innerHTML = "-";
				m1_contact.innerHTML = "-";

				
				// hide the checkbox
				check2.style.display = "none";
			}
			if (data["M2"].trim() == "") {
				m2.innerHTML = "-";
				m2_email.innerHTML = "-";
				m2_contact.innerHTML = "-";

				// hide the checkbox
				check3.style.display = "none";
			}
			if (data["M3"].trim() == "") {
				m3.innerHTML = "-";
				m3_email.innerHTML = "-";
				m3_contact.innerHTML = "-";
				// hide the checkbox
				check4.style.display = "none";
			}
			if (data["M4"].trim() == "") {
				m4.innerHTML = "-";
				m4_email.innerHTML = "-";
				m4_contact.innerHTML = "-";
				// hide the checkbox
				check5.style.display = "none";
			}

			// check if team is checked in
			if (data["Check-in"] == "Yes") {
				// check the checkboxes if members is yes
				if (data["TL Check-in"] == "Yes") {
					check1.checked = true;
				}
				if (data["M1 Check-in"] == "Yes") {
					check2.checked = true;
				}
				if (data["M2 Check-in"] == "Yes") {
					check3.checked = true;
				}
				if (data["M3 Check-in"] == "Yes") {
					check4.checked = true;
				}
				if (data["M4 Check-in"] == "Yes") {
					check5.checked = true;
				}

				check_in_button.innerHTML = "Checked In";
				check_in_button.disabled = true;

				// disable the checkboxes
				check1.disabled = true;
				check2.disabled = true;
				check3.disabled = true;
				check4.disabled = true;
				check5.disabled = true;
			}
		});

	// check in button add event listener for click
	check_in_button.addEventListener("click", function () {
		// check if already checked in
		if (check_in_button.innerHTML === "Checked In") {
			console.log("Already checked in");
			alert("Already checked in. Contact Harrish (+91 91504 58561)");
			return;
		}
		var url = base_url + "/teamdetails/" + teamcode;
		// check if checked in
		fetch(url, {
			method: "GET",
			mode: "cors",
			headers: cors_header,
		})
			.then((response) => response.json())
			.then((data) => {
				console.log(data);
				// check if team is checked in
				if (data["Check-in"] == "Yes") {
					console.log("Already checked in.");
					alert("Already checked in. Contact Harrish (+91 91504 58561)");
					return;
				}
			});
		// check if at least one member is checked in
		if (check1.checked === false && check2.checked === false && check3.checked === false && check4.checked === false && check5.checked === false) {
			console.log("No member checked in.");
			alert("No member checked in. Contact Harrish (+91 91504 58561)");
			return;
		}
		// check if team leader is checked in
		if (check1.checked === false) {
			console.log("Team Leader not checked in");
			alert("Team Leader not checked in. Contact Harrish (+91 91504 58561)");
			return;
		}
		arr = ["TL"];

		if (check2.checked === true) {
			arr.push("M1");
		}
		if (check3.checked === true) {
			arr.push("M2");
		}
		if (check4.checked === true) {
			arr.push("M3");
		}
		if (check5.checked === true) {
			arr.push("M4");
		}
		console.log(arr);

		if (arr.length < 2) {
			console.log("2 Members Required to Check In.");
			alert("2 Members Required to Check In. Contact Harrish (+91 91504 58561)");
			return;
		}

		var url = base_url + "/checkin/" + teamcode;
		console.log(url);

		body = {
			members: arr.toString(),
		};
		body = JSON.stringify(body);
		console.log(body);

		// check in
		fetch(url, {
			method: "POST",
			mode: "cors",
			headers: cors_header,
			body: body,
			contentType: "application/json",
		})
			.then((response) => response.json())
			.then((data) => {
				console.log(data);
				window.location.reload();
			});
	});
});
