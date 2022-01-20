import { SlashCommandBuilder } from '@discordjs/builders';
import { CommandInteraction } from 'discord.js';
import { modelsInfo } from '../firestore';
var logger = require('winston');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('bwb')
    .setDescription('Generates a random Bed/Wed/Behead trio.'),
  async execute(interaction: CommandInteraction) {
    const characters = modelsInfo.getUniqueCharacters(3);
    const nameText = characters.map((char) => char.name).join('\n');
    const text = `Bed/Wed/Behead:\n${nameText}`;
    await interaction.reply({ content: text });
    const fileNames = characters.map((character) => character.randomImage());
    await interaction.editReply({ files: fileNames });
  },
};
