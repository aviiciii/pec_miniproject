// script.js file
const base_url = "http://127.0.0.1:5000";


function domReady(fn) {
	if (
		document.readyState === "complete" ||
		document.readyState === "interactive"
	) {
		setTimeout(fn, 1000);
	} else {
		document.addEventListener("DOMContentLoaded", fn);
	}
}

domReady(function () {

	// If found you qr code
	function onScanSuccess(decodeText, decodeResult) {
		// alert("You Qr is : " + decodeText, decodeResult);


		code = decodeText;
		console.log("decodetext:" + code);
		window.location.href = "/check_in.html?code=" + code;
	}

	let htmlscanner = new Html5QrcodeScanner(
		"my-qr-reader",
		{ fps: 10, qrbos: 250 }
	);
	htmlscanner.render(onScanSuccess);
});


// javascript
// add cors to api
// fetch api


function callAPI(code){
	// https api
	var url = "https://api.qrserver.com/v1/read-qr-code/";
	console.log(url);
	// fetch
	fetch(url)
	.then(response => response.json())
}

var btn = document.getElementById("submit-button");
var input = document.getElementById("team-id");

btn.addEventListener("click", function () {
	team_id = input.value;
	team_id = team_id.trim();
	if (team_id == "") {
		alert("Please enter your team id");
		return;
	}
	if (team_id.length != 3) {
		alert("Please enter a valid team id");
		return;
	}
	// capitalize the team id
	team_id = team_id.toUpperCase();
	
	// call the api
	var url = base_url + "/teamcode/" + team_id;

	// fetch
	fetch(url)
	.then(response => response.json())
	.then(data => {
		console.log(data);
		teamcode = data.teamcode;
		if (data.status == "success") {
			// redirect to check in page
			window.location.href = "/check_in.html?code=" + teamcode;
		}
		else {
			alert("Team not found");
		}
	})


});