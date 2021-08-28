import fs = require('fs');
import { Client, Collection, Intents, Message } from "discord.js";
var logger = require('winston');
require('dotenv').config();
var messageConfig = require('./config.json');

// Configure logger settings
logger.remove(logger.transports.Console);
logger.add(new logger.transports.Console, {
  colorize: true
});
logger.level = 'debug';

const client = new Client({ intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES, Intents.FLAGS.GUILD_MESSAGE_REACTIONS] });

// Login to Discord with your client's token
client.login(process.env.TOKEN);

var commands = new Collection<String, any>();
var emojiCodes = {};

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
        logger.info(`Emoji ${emoji.name} matches regex ${value} for ${key}`);
        return true;
      }
      return false;
    });
    if (found) {
      emojiCodes[key] = found;
    }
  });

  const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));
  logger.info(`Registering ${commandFiles.length} commands.`);
  for (var index in commandFiles) {
    const file = commandFiles[index];
    var command = require(`./commands/${file}`);
    commands.set(command.data.name, command);
  }
});

client.on('interactionCreate', async interaction => {
  if (!interaction.isCommand()) return;
  logger.info(`Processing interaction ${interaction.commandName}`);

  const command = commands.get(interaction.commandName);
  if (!command) return;

  try {
    if (interaction.guild.name == "Liergaard's dev server" && command.devExecute != undefined) {
      logger.info(`Using ${interaction.commandName}.devExecute.`);
      return await command.devExecute(interaction);
    }
    await command.execute(interaction);
  } catch (error) {
    console.error(error);
    await interaction.reply({ content: 'There was an error while executing this command!', ephemeral: true });
  }
});

client.on('messageCreate', (message) => {
  _handleMessage(message);
});

var _handleMessage = function (message: Message) {
  if (message.author.id == client.user.id) {
    return;
  }
  if (message.guild.name == "Liergaard's dev server") {
    logger.info(`Processing message: ${message.content} in server ${message.guildId}`);
  }

  Object.keys(emojiCodes).forEach((key) => {
    var regex = RegExp(key, 'i');
    var matches = regex.exec(message.content);
    if (matches && matches.length > 0) {
      message.react(emojiCodes[key]).catch((reason) => {
        logger.error(`Could not react to message: no emoji matching ${emojiCodes[key]} found. ${reason}.`);
      });
    }
  });
}