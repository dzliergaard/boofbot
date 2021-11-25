// import { Client, Collection, Intents, Message } from "discord.js";
// const client = new Discord.Client();
// const settings = require("./settings.json");

// var deck = [
// 	["1 of Rams", 1, "1R"],
// 	["1 of Crows", 1, "1C"],
// 	["1 of Tomes", 1, "1T"],
// 	["1 of Masks", 1, "1M"],
// 	["2 of Rams", 2, "2R"],
// 	["2 of Crows", 2, "2C"],
// 	["2 of Tomes", 2, "2T"],
// 	["2 of Masks", 2, "2M"],
// 	["3 of Rams", 3, "3R"],
// 	["3 of Crows", 3, "3C"],
// 	["3 of Tomes", 3, "3T"],
// 	["3 of Masks", 3, "3M"],
// 	["4 of Rams", 4, "4R"],
// 	["4 of Crows", 4, "4C"],
// 	["4 of Tomes", 4, "4T"],
// 	["4 of Masks", 4, "4M"],
// 	["5 of Rams", 5, "5R"],
// 	["5 of Crows", 5, "5C"],
// 	["5 of Tomes", 5, "5T"],
// 	["5 of Masks", 5, "5M"],
// 	["*6 of Rams*", 6, "6R"],
// 	["*6 of Crows*", 6, "6C"],
// 	["*6 of Tomes*", 6, "6T"],
// 	["*6 of Masks*", 6, "6M"],
// 	["*7 of Rams*", 7, "7R"],
// 	["*7 of Crows*", 7, "7C"],
// 	["*7 of Tomes*", 7, "7T"],
// 	["*7 of Masks*", 7, "7M"],
// 	["*8 of Rams*", 8, "8R"],
// 	["*8 of Crows*", 8, "8C"],
// 	["*8 of Tomes*", 8, "8T"],
// 	["*8 of Masks*", 8, "8M"],
// 	["*9 of Rams*", 9, "9R"],
// 	["*9 of Crows*", 9, "9C"],
// 	["*9 of Tomes*", 9, "9T"],
// 	["*9 of Masks*", 9, "9M"],
// 	["*10 of Rams*", 10, "10R"],
// 	["*10 of Crows*", 10, "10C"],
// 	["*10 of Tomes*", 10, "10T"],
// 	["*10 of Masks*", 10, "10M"],
// 	["**11 of Rams**", 11, "11R"],
// 	["**11 of Crows**", 11, "11C"],
// 	["**11 of Tomes**", 11, "11T"],
// 	["**11 of Masks**", 11, "11M"],
// 	["**12 of Rams**", 12, "12R"],
// 	["**12 of Crows**", 12, "12C"],
// 	["**12 of Tomes**", 12, "12T"],
// 	["**12 of Masks**", 12, "12M"],
// 	["**13 of Rams**", 13, "13R"],
// 	["**13 of Crows**", 13, "13C"],
// 	["**13 of Tomes**", 13, "13T"],
// 	["**13 of Masks**", 13, "13M"],
// 	["***Black Joker***", 0, "BJ"],
// 	["***Red Joker***", 14, "RJ"]];

// var vicTwist = new Array(
// 	["**13 of Crows**", 13, "13C"],
// 	["**12 of Tomes**", 12, "12T"],
// 	["**11 of Rams**", 11, "11R"],
// 	["*10 of Masks*", 10, "10M"],
// 	["*9 of Crows*", 9, "9C"],
// 	["*8 of Tomes*", 8, "8T"],
// 	["*7 of Rams*", 7, "7R"],
// 	["*6 of Masks*", 6, "6M"],
// 	["5 of Crows", 5, "5C"],
// 	["4 of Tomes", 4, "4T"],
// 	["3 of Rams", 3, "3R"],
// 	["2 of Masks", 2, "2M"],
// 	["1 of Crows", 1, "1C"]
// );
// var vicShuffTwist = new Array();
// var mattGTwist = new Array();
// var mattGShuffTwist = new Array();
// var scottTwist = new Array();
// var scottShuffTwist = new Array();
// var bittyTwist = new Array();
// var bittyShuffTwist = new Array();

// var vicTwist = [
// 	["**13 of Crows**", 13, "13C"],
// 	["**12 of Tomes**", 12, "12T"],
// 	["**11 of Rams**", 11, "11R"],
// 	["*10 of Masks*", 10, "10M"],
// 	["*9 of Crows*", 9, "9C"],
// 	["*8 of Tomes*", 8, "8T"],
// 	["*7 of Rams*", 7, "7R"],
// 	["*6 of Masks*", 6, "6M"],
// 	["5 of Crows", 5, "5C"],
// 	["4 of Tomes", 4, "4T"],
// 	["3 of Rams", 3, "3R"],
// 	["2 of Masks", 2, "2M"],
// 	["1 of Crows", 1, "1C"]];

// var vicHand = new Array();
// var vicCards = 0;

// mattGTwist = [
// 	["**13 of Rams**", 13, "13R"],
// 	["**12 of Tomes**", 12, "12T"],
// 	["**11 of Crows**", 11, "11C"],
// 	["*10 of Masks*", 10, "10M"],
// 	["*9 of Rams*", 9, "9R"],
// 	["*8 of Tomes*", 8, "8T"],
// 	["*7 of Crows*", 7, "7C"],
// 	["*6 of Masks*", 6, "6M"],
// 	["5 of Rams", 5, "5R"],
// 	["4 of Tomes", 4, "4T"],
// 	["3 of Crows", 3, "3C"],
// 	["2 of Masks", 2, "2M"],
// 	["1 of Rams", 1, "1R"]];

// var mattGHand = new Array();
// var mattGCards = 0;

// var scottTwist = [
// 	["**13 of Crows**", 13, "13C"],
// 	["**12 of Rams**", 12, "12R"],
// 	["**11 of Masks**", 11, "11M"],
// 	["*10 of Tomes*", 10, "10T"],
// 	["*9 of Crows*", 9, "9C"],
// 	["*8 of Rams*", 8, "8R"],
// 	["*7 of Masks*", 7, "7M"],
// 	["*6 of Tomes*", 6, "6T"],
// 	["5 of Crows", 5, "5C"],
// 	["4 of Rams", 4, "4R"],
// 	["3 of Masks", 3, "3M"],
// 	["2 of Tomes", 2, "2T"],
// 	["1 of Crows", 1, "1C"]];

// var scottHand = new Array();
// var scottCards = 0;

// var bittyTwist = [
// 	["**13 of Rams**", 13, "13R"],
// 	["**12 of Tomes**", 12, "12T"],
// 	["**11 of Masks**", 11, "11M"],
// 	["*10 of Crows*", 10, "10C"],
// 	["*9 of Rams*", 9, "9R"],
// 	["*8 of Tomes*", 8, "8T"],
// 	["*7 of Masks*", 7, "7M"],
// 	["*6 of Crows*", 6, "6C"],
// 	["5 of Rams", 5, "5R"],
// 	["4 of Tomes", 4, "4T"],
// 	["3 of Masks", 3, "3M"],
// 	["2 of Crows", 2, "2C"],
// 	["1 of Rams", 1, "1R"]];

// var bittyHand = new Array();
// var bittyCards = 0;


// var sass = [
// 	"Congratulations on your miserable failure",
// 	"Uh oh",
// 	"Oh noes!",
// 	"\"Bad Things Happen\" as they say",
// 	"Sucks to be you",
// 	"Oopsie Poopsie",
// 	"That's a 'zero', by the way",
// 	"Oof...hope that wasn't important",
// 	"The House always wins",
// 	"That's gotta hurt",
// 	"Hey look! my favorite card!",
// 	"Commence the crying",
// 	"Seems like you pissed Fate off",
// 	"Could be worse. Could have happened to someone I *like*",
// 	"How'd *THAT* get in there?",
// 	"Better luck next time"];

// var grats = [
// 	"Wooo!",
// 	"Something something 'poultry supper'?",
// 	"Drinks are on you!",
// 	"Nice",
// 	"That's the good one, right?",
// 	"*flips table* YEAAAHHH!!",
// 	"Congratulations!",
// 	"Jackpot!",
// 	"Nailed it",
// 	"EHHHH? NANI?!",
// 	"REEEEEEEEEEED JOOOOOOOOKEEEERRR!!!",
// 	"*dances*",
// 	"Leave a nice tip for your lovely dealer, perhaps?",
// 	"I'm going to lose my job if you don't start failing",
// 	"It's not like I wanted you to flip a Red Joker or anything...B-baka!"];

// var discard = [];
// var vicDisc = [];
// var mattGDisc = [];
// var scottDisc = [];
// var bittyDisc = [];
// var disSass = [];
// var disGrats = [];
// var shufFlag = 0;
// var players = [
// 	["340929362033508353", vicTwist, vicShuffTwist, vicDisc, vicHand, vicCards, 3],
// 	["415162955647287306", scottTwist, scottShuffTwist, scottDisc, scottHand, scottCards, 3],
// 	["274004186583269376", mattGTwist, mattGShuffTwist, mattGDisc, mattGHand, mattGCards, 3],
// 	["406925189243338782", bittyTwist, bittyShuffTwist, bittyDisc, bittyHand, bittyCards, 4]
// ];

// function findPlayer(id) {
// 	var loc = 'X';
// 	for (i = 0; i < players.length; i++) {
// 		if (id == players[i][0]) {
// 			var loc = i;
// 		}
// 	}
// 	return { tmp1: loc };
// };

// function findCard(code, hand) {
// 	var loc = 'X';
// 	for (i = 0; i < hand.length; i++) {
// 		if (code == hand[i][1] || code == hand[i][2]) {
// 			var loc = i;
// 		}
// 	}
// 	return { tmp1: loc };
// };

// function shuffle(array) {
// 	var currentIndex = array.length, temporaryValue, randomIndex;

// 	// While there remain elements to shuffle...
// 	while (0 !== currentIndex) {

// 		// Pick a remaining element...
// 		randomIndex = Math.floor(Math.random() * currentIndex);
// 		currentIndex -= 1;

// 		// And swap it with the current element.
// 		temporaryValue = array[currentIndex];
// 		array[currentIndex] = array[randomIndex];
// 		array[randomIndex] = temporaryValue;
// 	}

// 	return array;
// };

// function reshuffle() {
// 	console.log(discard);
// 	var temp = deck.concat(discard);
// 	shuffle(temp);
// 	deck = temp;
// 	console.log(deck);
// 	discard = [];
// };

// deck = shuffle(deck);
// sass = shuffle(sass);
// grats = shuffle(grats);
// vicShuffTwist = shuffle(vicTwist);
// mattGShuffTwist = shuffle(mattGTwist);
// scottShuffTwist = shuffle(scottTwist);
// bittyShuffTwist = shuffle(bittyTwist);

// function deckDraw(output, comment) {
// 	if (deck.length == 0) {
// 		deck = shuffle(discard);
// 		discard = [];
// 		shufFlag = 1;
// 	};
// 	if (grats.length == 0) {
// 		grats = shuffle(disGrats);
// 		disGrats = [];
// 	};
// 	if (sass.length == 0) {
// 		sass = shuffle(disSass);
// 		disSass = [];
// 	};
// 	var card = deck.pop();
// 	discard.push(card);
// 	var tmp1 = output + "\n" + card[0];
// 	if (card[0] === "***Red Joker***" && comment === "") {
// 		var temp = grats.pop();
// 		comment = "\n**" + temp + "**";
// 		disGrats.push(temp);
// 	} else if (card[0] === "***Black Joker***") {
// 		var temp = sass.pop();
// 		comment = "\n***" + temp + "***";
// 		disSass.push(temp);
// 	}
// 	return { tmp1: tmp1, tmp2: comment };
// };

// // nomsg
// function twistDraw(output, twist, shuffTwist, tDisc, hand, cards) {  // nomsg
// 	cards++;
// 	if (twist.length == 0) {
// 		console.log('waffles' + shuffTwist);
// 		twist = shuffle(tDisc);
// 		tDisc = [];
// 	}
// 	var card = twist.pop();
// 	hand.push(card);
// 	var tmp1 = output + "\n" + card[0];
// 	return { tmp1: tmp1 };
// };

// function twistHand(user, hand) {
// 	var flag = 0;
// 	var index;
// 	var index2;
// 	var tmp = "";
// 	for (index = 0; index < hand.length; index++) {
// 		flag = 1;
// 		var card = hand[index];
// 		tmp += card[0] + '\n';
// 	}
// 	if (flag == 0) {
// 		tmp = "No cards in hand.";
// 	}
// 	client.users.get(user).send(tmp);
// }


// client.on('ready', function () {
// 	console.log("Beep Boop. Want to play a game?");
// });

// client.on("message", function (message) {
// 	var input = message.content.toUpperCase();
// 	var output = "";
// 	var comment = "";
// 	if (input.substring(0, 5) === "!FLIP") {
// 		if (input.length === 5) {
// 			var cycle = 1;
// 		} else if (input.length < 8) {
// 			var cycle = parseInt(input.substring(5));
// 		} else {
// 			var cycle = 'NaN';
// 		}
// 		if (cycle != 'NaN' && cycle > 0 && cycle < 54) {
// 			for (i = 0; i < cycle; i++) {
// 				var temp = deckDraw(output, comment);
// 				output = temp.tmp1;
// 				comment = temp.tmp2;
// 			}
// 			msg = output + comment;
// 			message.reply(msg);
// 		} else {
// 			message.reply('Care to try that again?');
// 		}

// 	} else if (input.substring(0, 6) === "!START") {
// 		var playerNum = players.length;
// 		console.log(playerNum);
// 		for (i = 0; i < playerNum; i++) {
// 			console.log(i);
// 			var player = players[i];
// 			var uid = players[i][0];
// 			var hSize = players[i][6];
// 			for (j = 0; j < hSize; j++) {
// 				var temp = twistDraw(output, player[1], player[2], player[3], player[4], player[5]);
// 				output = temp.tmp1;
// 			}
// 			client.users.get(uid).send(output);
// 			var output = "";
// 		}

// 	} else if (input.substring(0, 5) === "!DRAW") {
// 		var temp = findPlayer(message.author.id);
// 		var loc = temp.tmp1;
// 		if (loc != 'X') {
// 			var player = players[temp.tmp1];
// 			var uid = player[0];
// 			var temp = twistDraw(output, player[1], player[2], player[3], player[4], player[5]);
// 			output = temp.tmp1;
// 			client.users.get(uid).send(output);
// 		} else {
// 			message.author.send("I don't deal to strangers. Take it up with the Fatemaster.");
// 		}
// 	} else if (input.substring(0, 18) === "DECK CHAN SAVE ME!") {
// 		message.reply("Aren't you supposed to be the one protecting me?");
// 	} else if (input.substring(0, 15) === "@DECK CHAN#6207") {
// 		if (input.slice(-10) === "I HATE YOU") {
// 			message.reply("Your salt only makes me stronger");
// 		}
// 	} else if (input.substring(0, 10) === "!RESHUFFLE") {
// 		reshuffle();
// 		message.channel.send("Already?...Ugh...\n" +
// 			"@everyone Deck Chan does the deck thing *shuffles*\n draw a card");
// 	} else if (input.substring(0, 6) === "!CHEAT") {
// 		var temp = findPlayer(message.author.id);
// 		var loc = temp.tmp1;
// 		console.log(loc);
// 		if (loc != 'X') {
// 			var code = input.substring(6);
// 			var player = players[temp.tmp1];
// 			var hand = player[4];
// 			var temp = findCard(code, hand);
// 			var loc = temp.tmp1;
// 			console.log(loc);
// 			if (loc != 'X') {
// 				message.channel.send("Cheated " + hand[temp.tmp1][0]);
// 				player[3].push(hand[temp.tmp1]);
// 				player[4].splice(temp.tmp1, 1);
// 			} else {
// 				message.channel.send("Sorry, my dude, but you don't got that card");
// 			}
// 		} else {
// 			message.channel.send("Sorry, only cool kids get to cheat");
// 		}
// 	} else if (input.substring(0, 5) === "!HAND") {
// 		var temp = findPlayer(message.author.id);
// 		if (temp.tmp1 != 'X') {
// 			var player = players[temp.tmp1];
// 			var uid = player[0];
// 			twistHand(uid, player[4]);
// 		} else {
// 			message.author.send("Hey nerd, We're trying to play a game here. Go find another table to bother.");
// 		}
// 	};

// 	if (shufFlag === 1) {
// 		message.channel.send("@everyone Deck Chan does the *shuffle shuffle*\n everyone draws!");
// 		shufFlag = 0;
// 	};

// });


// client.login(settings.token);

