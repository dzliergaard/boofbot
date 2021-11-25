import fs = require('fs');
import { REST } from '@discordjs/rest';
import { Routes } from 'discord-api-types/v9';
import { clientID, guildID, token } from './config';

const commands = [];
const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
  const command = require(`./commands/${file}`);
  commands.push(command.data.toJSON());
}

const rest = new REST({ version: '9' }).setToken(token);

(async () => {
  try {
    const response = await rest.put(
      Routes.applicationGuildCommands(clientID, guildID),
      { body: commands },
    );

    console.log(`Successfully registered ${commands.length} application commands to guild ${guildID}.`);
  } catch (error) {
    console.error(error);
  }
})();