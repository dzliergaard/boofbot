import fs = require('fs');
import { REST } from '@discordjs/rest';
import { Routes } from 'discord-api-types/v9';
import { clientID, guildID, token } from './config';
import { Client, GatewayIntentBits } from 'discord.js';

const commands = [];
const permissions = {};
const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
  const command = require(`./commands/${file}`);
  commands.push(command.data.toJSON());
  if (command.permissions) {
    permissions[command.data.name] = command.permissions;
  }
}

const rest = new REST({ version: '9' }).setToken(token);


// Get existing commands.
const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.GuildMessageReactions,
  ]
});


// Login to Discord with your client's token
client.login(token);

client.once('ready', async () => {

  client.guilds.cache.get(guildID).commands.set([]);
  client.application.commands.set([]);
  (async () => {
    try {
      const response = await rest.get(
        Routes.applicationGuildCommands(clientID, guildID),
      );

      console.log(`Existing commands in guild ${guildID}: ${response.map((command) => command.name).join(', ')}`);

      const globalResponse = await rest.get(
        Routes.applicationCommands(clientID),
      );

      console.log(`Existing global commands: ${globalResponse.map((command) => command.name).join(', ')}`);
    } catch (error) {
      console.error(error);
    }
  })();
});
