import fs = require('fs');
import { Client, Collection, Intents, Message } from "discord.js";
import { SlashCommandBuilder } from '@discordjs/builders';
var logger = require('winston');
var messageConfig = require('./react-config.json');
import { guildID, token } from './config';

// Configure logger settings
logger.remove(logger.transports.Console);
logger.add(new logger.transports.Console, {
  colorize: true
});
logger.level = 'debug';

const client = new Client({
  intents: [
    Intents.FLAGS.GUILDS,
    Intents.FLAGS.GUILD_MESSAGES,
    Intents.FLAGS.GUILD_MESSAGE_REACTIONS,
  ]
});


// Login to Discord with your client's token
client.login(token);

var commands = new Collection<String, any>();
var emojiCodes = {};

// When the client is ready, run this code (only once)
client.once('ready', async () => {
  Object.keys(messageConfig).forEach((key) => {
    var value = messageConfig[key];
    // Emoji codes match their values by default, assuming they are unicode.
    emojiCodes[key] = value;

    var found = client.emojis.cache.find((emoji) => {
      var regex = new RegExp(value);
      if (regex.exec(emoji.name)) {
        return true;
      }
      return false;
    });
    if (found) {
      emojiCodes[key] = found;
    }
  });

  await client.application.fetch().then(async (application) => {
    if (!application?.owner) await application?.fetch();
    const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));
    logger.info(`Registering ${commandFiles.length} command files.`);
    for (var index in commandFiles) {
      const file = commandFiles[index];
      var commandFile = require(`./commands/${file}`);
      const command: SlashCommandBuilder = commandFile.data;
      commands.set(command.name, commandFile);
      const builtCommand = await application.commands.create({
        name: command.name,
        description: command.description,
        defaultPermission: command.defaultPermission,
      });
      logger.info(`Created command ${builtCommand.name}/${builtCommand.id}`);
    }

    await client.guilds.cache.get(guildID)?.commands.permissions.set(
      {
        command: "882368495512338452",
        permissions: [
          {
            id: '722446885423546420',
            type: 'ROLE',
            permission: true,
          },
          {
            id: '881371527273144330',
            type: 'ROLE',
            permission: true,
          },
          {
            id: '590690199554752523',
            type: 'ROLE',
            permission: true,
          },
          {
            id: '590693611151294464',
            type: 'ROLE',
            permission: true,
          },
        ],
      });
  });
  logger.info('Ready!');
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
    await interaction.reply({
      content: 'There was an error while executing this command!', ephemeral: true
    });
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

  if (message.content.match(/\bgood bots?\b/i)) {
    message.reply("🍑");
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