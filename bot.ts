import { Client, Message } from "discord.js";
var logger = require('winston');
require('dotenv').config();
var messageConfig = require('./config.json');

// Configure logger settings
logger.remove(logger.transports.Console);
logger.add(new logger.transports.Console, {
  colorize: true
});
logger.level = 'debug';

const client = new Client();

// Login to Discord with your client's token
client.login(process.env.TOKEN);

// var indeedEmoji: GuildEmoji;
var emojiCodes = {};
// TODO: Re-add booflink for !boof define
var defineRegex = /^\!boof define/i;
const booflink = "https://www.urbandictionary.com/define.php?term=Boof";

// When the client is ready, run this code (only once)
client.once('ready', () => {
  logger.info('Ready!');
  logger.info('Finding react emojis for keys.');
  Object.keys(messageConfig).forEach((key) => {
    var value = messageConfig[key];
    // Emoji codes match their values by default, assuming they are unicode.
    emojiCodes[key] = value;

    var found = client.emojis.cache.find((emoji) => {
      var regex = new RegExp(value);
      if (regex.exec(emoji.name)) {
        logger.info('Emoji ' + emoji.name + ' matches regex ' + value);
        return true;
      }
      return false;
    });
    if (found) {
      emojiCodes[key] = found;
    }
  });
  logger.info('Emoji codes: ' + JSON.stringify(emojiCodes));
});

// TODO: Figure out slash commands.
// client.on('interactionCreate', async (interaction) => {
//   logger.info("Checking " + interaction + " for command 'defineboof.");
//   if (!interaction.isCommand()) return;

//   logger.info("Interaction " + interaction + " is a command.");
//   const { commandName } = interaction;

//   if (commandName === 'defineboof') {
//     logger.info("Interaction " + interaction + " is 'defineboof'.");
//     await interaction.reply(booflink);
//   }
// });

client.on('message', (message) => _handleMessage(message));

var _devHandleMessage = function (message: Message) {
  if (message.author.id == client.user.id) {
    return;
  }

  var defineMatches = defineRegex.exec(message.content);
  if (defineMatches && defineMatches.length > 0) {
    message.channel.send(booflink);
    return;
  }
  Object.keys(emojiCodes).forEach((key) => {
    var regex = RegExp(key, 'i');
    var matches = regex.exec(message.content);
    if (matches && matches.length > 0) {
      message.react(emojiCodes[key]).catch((reason) => {
        logger.error("Could not react to message: no emoji matching " + emojiCodes[key] + " found. " + reason);
      });
    }
  });
}


var _handleMessage = function (message: Message) {
  if (message.guild.name == "Liergaard's dev server") {
    return _devHandleMessage(message);
  }
  Object.keys(messageConfig).forEach((key) => {
    var regex = RegExp(key, 'i');
    var matches = regex.exec(message.content);
    if (matches && matches.length > 0) {
      message.react(messageConfig[key]);
    }
  });
}