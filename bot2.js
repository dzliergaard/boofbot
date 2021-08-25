"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const discord_js_1 = require("discord.js");
var logger = require('winston');
require('dotenv').config();
var messageConfig = require('./config.json');
// Configure logger settings
logger.remove(logger.transports.Console);
logger.add(new logger.transports.Console, {
    colorize: true
});
logger.level = 'debug';
const client = new discord_js_1.Client();
// Login to Discord with your client's token
client.login(process.env.token);
// var indeedEmoji: GuildEmoji;
var emojiCodes = {};
const indeedRegex = /\bindeed\b/i;
const defineRegex = /^\!boof define/i;
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
client.on('message', (message) => _handleMessage(message));
var _devHandleMessage = function (message) {
    logger.info("Handling message in guild " + message.guild.name);
    Object.keys(emojiCodes).forEach((key) => {
        var regex = RegExp(key, 'i');
        var matches = regex.exec(message.content);
        if (matches && matches.length > 0) {
            logger.info('Reacting to ' + message.content + ' with ' + JSON.stringify(emojiCodes[key]));
            message.react(emojiCodes[key]).catch((reason) => {
                logger.error("Could not react to message: no emoji matching " + emojiCodes[key] + " found. " + reason);
            });
        }
    });
};
var _handleMessage = function (message) {
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
};
//# sourceMappingURL=bot2.js.map