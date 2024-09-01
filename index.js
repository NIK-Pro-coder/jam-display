/* index.js */

const fs = require("fs");
const path = require("path");

const entries = JSON.parse(fs.readFileSync("entries.json"));

const express = require("express");
const app = express();

app.use(express.static(__dirname + "/"));
app.set("view engine", "ejs");

const router = express.Router();
let visited = [];

function getRandom(arr, n) {
	var result = new Array(n),
		len = arr.length,
		taken = new Array(len);
	if (n > len)
		throw new RangeError("getRandom: more elements taken than available");
	while (n--) {
		var x = Math.floor(Math.random() * len);
		var test = arr[x in taken ? taken[x] : x];
		if (test) {
			result[n] = test;
		}
		taken[x] = --len in taken ? taken[len] : len;
	}
	return result;
}

app.get("/", function (req, res) {
	const games = getRandom(entries.jam_games, entries.jam_games.length);

	let img = [];
	let link = [];
	let titles = [];

	for (let i = 0; i < games.length; i++) {
		let me = games[i];

		img.push(me.game.cover);
		link.push(me.id);
		titles.push(me.game.title);
	}

	res.render("index", {
		games: entries.jam_games.length,
		images: img,
		links: link,
		title: titles,
	});
});
app.get("/notfound", function (req, res) {
	res.render("notfound");
});
app.get("/game/:gameId", (req, res) => {
	const id = req.params.gameId;
	let given = {};
	let found = false;

	entries.jam_games.forEach((val) => {
		if (val.id == id) {
			given = val;
			found = true;
		}
	});

	if (found) {
		visited.push(given);

		res.render("game", given);
	} else {
		res.redirect("/notfound");
	}
});
app.get("/random", (req, res) => {
	let availible = [];

	if (visited.length === entries.jam_games.length) {
		visited = [];
	}

	entries.jam_games.forEach((val) => {
		if (!visited.includes(val)) {
			availible.push(val);
		}
	});

	res.redirect(
		"/game/" + availible[Math.floor(Math.random() * availible.length)].id,
	);
});

const http = require("http").createServer(app);

app.listen(3000, () => {
	console.log("Server is running on port : 3000");
});
