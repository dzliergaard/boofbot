import { SlashCommandBuilder } from '@discordjs/builders';
import { CommandInteraction } from 'discord.js';
import { modelsInfo } from '../firestore';
var logger = require('winston');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('bwbb')
    .setDescription('Generates a random Bed/Wed/Behead trio and also beheads Nellie.'),
  async execute(interaction: CommandInteraction) {
    const characters = modelsInfo.getUniqueCharacters(3);
    const nameText = characters.map((char) => char.name).join('\n');
    const text = `Bed/Wed/Behead:\n${nameText}\nBehead Nellie Cochrane`;
    await interaction.reply({ content: text });
    const fileNames = characters.map((character) => character.randomImage());
    fileNames.push(modelsInfo.models['Nellie Cochrane'].randomImage());
    await interaction.editReply({ files: fileNames });
  },
};
