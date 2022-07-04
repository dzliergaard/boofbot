import { SlashCommandBuilder } from '@discordjs/builders';
import { CommandInteraction } from 'discord.js';
import { modelsInfo } from '../firestore';
var logger = require('winston');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('hh')
    .setDescription('Get a truly random, probably illegal Henchman Hardcore crew.'),
  async execute(interaction: CommandInteraction) {
    _execute(interaction);
  }
};

async function _execute(interaction: CommandInteraction, tries: number = 0) {
  if (tries > 10) {
    interaction.reply(`Failed to create valid HH after 10 tries.`);
    return;
  }
  var cost = 30;
  const henchman = modelsInfo.getUniqueCharacters(1, false, 'Henchman', cost)[0];
  cost -= henchman.cost;
  const enforcer = modelsInfo.getUniqueCharacters(1, false, 'Enforcer', cost)[0];
  cost -= enforcer.cost;
  var minionOne = modelsInfo.getUniqueCharacters(1, false, 'Minion', cost / 2)[0];
  if (!minionOne) {
    // No valid minions - retry.
    logger.info(`Retrying: no valid minions.`);
    return _execute(interaction, tries++);
  }
  cost -= minionOne.cost;
  var minionTwo = modelsInfo.getUniqueCharacters(1, false, 'Minion', cost)[0];
  // If there's no valid second minion, just retry the whole thing.
  if (!minionTwo) {
    logger.info(`Retrying from cost ${cost}.`);
    return _execute(interaction, tries++);
  }
  const text = `Your Henchman Hardcore team:\n${henchman.displayName} (${henchman.cost}) \n${enforcer.displayName} (${enforcer.cost})\n${minionOne.displayName} (${minionOne.cost})\n${minionTwo.displayName} (${minionTwo.cost})`;
  await interaction.reply(text);

  const fileNames = [
    henchman.randomImage(),
    enforcer.randomImage(),
    minionOne.randomImage(),
    minionTwo.randomImage(),
  ];

  interaction.editReply({ files: fileNames });
}