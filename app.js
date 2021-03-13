/**
 * This script is to fetch data from espncricinfo.com and return short info about the match.
 * How to run
 * node app.js {site-link}
 * Made by Anmol Sharma 
 */

let request = require("request");
let cheerio = require("cheerio");

// For testing
// let url ="https://www.espncricinfo.com/series/england-tour-of-india-2020-21-1243364/india-vs-england-1st-t20i-1243388/full-scorecard";

cmds = process.argv.slice(2);
let url = cmds[0];


request(url, getMatchStatus);
console.log("\nMatch Result Finder\n")

function getMatchStatus(err, response, body) {
	if (err) {
		console.log(err);
	}
	
	// checking status code for security
	if (response.statusCode != 200) {
		console.log("Error in link");
		process.exit(0);
	}
	
	const $ = cheerio.load(body); // loding html to cheerio

	let teamA = $($(".name-link .name")[0]).text();
	let teamB = $($(".name-link .name")[1]).text();
	let maxScoreFirstInning = 0; // for max runs in first inning
	let maxScoreSecondInning = 0; // for max runs in second inning
	let maxWicketFirstInning = 0; // for max wickets in first inning
	let maxWicketSecondInning = 0; // for max wickets in second inning

	let firstInningScore = Number(
		$($(".text-right.font-weight-bold")[1]).text().split("/")[0]
		);
	let secondInningScore = Number(
		$($(".text-right.font-weight-bold")[3]).text().split("/")[0]
		);
	let firstInningWickets = Number(
		$($(".text-right.font-weight-bold")[1]).text().split("/")[1]
	);
	let secondInningWickets = Number(
		$($(".text-right.font-weight-bold")[3]).text().split("/")[1]
		);
		
	let runs = $(".table.batsman tbody td.font-weight-bold");
	let wicketsFirstInning = $(".table.bowler tbody:first").children().children();
	let wicketsSecondInning = $(".table.bowler tbody:last").children().children();
		
	// get Max run of first inning
	for (let x = 0; x <= (firstInningWickets+1); x++) {
		if (Number($(runs[x]).text()) > maxScoreFirstInning) {
			maxScoreFirstInning = Number($(runs[x]).text());
		}
	}

	// get Max run of second inning
	for(let x = firstInningWickets + 3  ; x < firstInningWickets + 5 + secondInningWickets ; x++){
		if (Number($(runs[x]).text()) > maxScoreSecondInning) {
			maxScoreSecondInning = Number($(runs[x]).text());
		}
	}

	
	// Get max Wicket taken by a team in first inning
	for (let x = 4; x < wicketsFirstInning.length; x+=11) {
		if(Number($(wicketsFirstInning[x]).text()) > maxWicketFirstInning){
			maxWicketFirstInning = Number($(wicketsFirstInning[x]).text());
		}
	}
	
	// Get max Wicket taken by a team in second inning
	for (let x = 4; x < wicketsSecondInning.length; x+=11) {
		if(Number($(wicketsSecondInning[x]).text()) > maxWicketSecondInning){
			maxWicketSecondInning = Number($(wicketsSecondInning[x]).text());
		}
		
	}

	
	if(!teamA.includes(" ")){
		console.log("Team\t\t\t" + teamA + "\tvs\t" + teamB);
		console.log("Score\t\t\t" + firstInningScore + "\t\t" + secondInningScore);
		console.log("wickets\t\t\t" + firstInningWickets + "\t\t" + secondInningWickets);
		console.log("Max runs\t\t" + maxScoreFirstInning + "\t\t" + maxScoreSecondInning);
		console.log("Max wickets get\t\t" + maxWicketSecondInning + "\t\t" + maxWicketFirstInning);
		console.log("Result : " + $(".event .status-text").text());
	}else{
		console.log("Team\t\t\t" + teamA + "\tvs\t" + teamB);
		console.log("Score\t\t\t" + firstInningScore + "\t\t\t" + secondInningScore);
		console.log("wickets\t\t\t" + firstInningWickets + "\t\t\t" + secondInningWickets);
		console.log("Max runs\t\t" + maxScoreFirstInning + "\t\t\t" + maxScoreSecondInning);
		console.log("Max wickets get\t\t" + maxWicketSecondInning + "\t\t\t" + maxWicketFirstInning);
		console.log("Result : " + $(".event .status-text").text());

	}

}



