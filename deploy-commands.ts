import fs = require('fs');
import { REST } from '@discordjs/rest';
import { Routes } from 'discord-api-types/v9';
import { clientID, guildID, token } from './config';

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
    const response: any = await rest.put(
      Routes.applicationGuildCommands(clientID, guildID),
      { body: commands },
    );

    console.log(`Successfully registered ${commands.length} application commands to guild ${guildID}`);

    response.forEach(async (command: { name: string | number; id: string; }) => {
      if (permissions[command.name]) {

        var permissionsResponse = await rest.put(
          Routes.applicationCommandPermissions(clientID, guildID, command.id),
          { body: { permissions: permissions[command.name] } },
        );

        console.info(`Registered permissions for ${command.name}: ${JSON.stringify(permissionsResponse)}`);
      }
    });

  } catch (error) {
    console.error(error);
  }
})();