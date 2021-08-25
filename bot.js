const { Server } = require('discord.io');
var Discord = require('discord.js');
var logger = require('winston');
var auth = require('./auth.json');
var messageConfig = require('./config.json');

// Configure logger settings
logger.remove(logger.transports.Console);
logger.add(new logger.transports.Console, {
  colorize: true
});
logger.level = 'debug';

// Initialize Discord client
var client = new Discord.Client();

var boofRegex = /\b(?:(?:un)|(?:de))boo(?:o)*f(?:(?:ing)|(?:er)|(?:s)|(?:bot)|(?:master)|(?:y))*\b/i;
var indeedRegex = /\bindeed\b/i;
var defineRegex = /^\!boof define/i;
var indeedEmoji;
var booflink = "https://www.urbandictionary.com/define.php?term=Boof";
client.on('ready', () => {
  logger.info('Connected');
  logger.info('Logged in as: ');
  logger.info('Emoji keys: ' + client.emojis.cache.keyArray());
  // logger.info('Message config: ' + JSON.stringify(messageConfig));
  indeedEmoji = client.emojis.cache.find(function (emoji) {
    var indeedEmojiMatches = indeedRegex.exec(emoji.name)
    if (indeedEmojiMatches && indeedEmojiMatches.length > 0) {
      return true;
    }
  });
});
client.on('message', message => {
  var defineMatches = defineRegex.exec(message.content);
  if (defineMatches && defineMatches.length > 0) {
    message.channel.send(booflink);
    return;
  }
  // Object.keys(messageConfig).forEach((key) => {
  //   var regex = RegExp(key.);
  //   logger.info("Checking for match on " + regex);
  //   var matches = regex.exec(message.content);
  //   logger.info("Matches: " + matches);
  //   if (matches && matches.length > 0) {
  //     logger.info("Matched regex " + regex + ". Reacting with " + messageConfig[key]);
  //     message.react(messageConfig[key]);
  //   }
  // });
  var matches = boofRegex.exec(message.content);
  if (matches && matches.length > 0) {
    message.react('🍑');
  }

  var indeedMatches = indeedRegex.exec(message.content);
  if (indeedMatches && indeedMatches.length > 0) {
    if (indeedEmoji) {
      message.react(indeedEmoji);
    }
  }
});

getEmoji = function (input) {
  var emoji = client.emojis.cache.keys
}


client.login(auth.token);