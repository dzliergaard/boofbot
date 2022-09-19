import fs = require('fs');
import { REST } from 'discord.js';
import { Routes } from 'discord-api-types/v9';
import { clientID, token } from './config';

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
(async () => {
  try {
    const existing: any = await rest.get(
      Routes.applicationCommands(clientID),
    );

    existing.forEach(async (command: { name: any; id: string; }) => {
      console.log(`Got command ${command.name} with id ${command.id}`);
      await rest.delete(Routes.applicationCommand(clientID, command.id))
    });



  } catch (error) {
    console.error(error);
  }
})();
