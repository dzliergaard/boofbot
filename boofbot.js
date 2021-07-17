var Discord = require('discord.js');
var logger = require('winston');
var auth = require('./auth.json');

// Configure logger settings
logger.remove(logger.transports.Console);
logger.add(new logger.transports.Console, {
  colorize: true
});
logger.level = 'debug';

// Initialize Discord client
var client = new Discord.Client();

var boofRegex = /\bboof\b/;
client.on('ready', () => {
  logger.info('Connected');
  logger.info('Logged in as: ');
  logger.info(client.username + ' - (' + client.id + ')');
});
client.on('message', message => {
  var matches = boofRegex.exec(message.content.toLowerCase());
  if (!matches || matches.length == 0) {
    return;
  }

  message.react('🍑');
});


client.login(auth.token);