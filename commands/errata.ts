import { SlashCommandBuilder } from '@discordjs/builders';
import { CommandInteraction } from 'discord.js';
import { modelsInfo, random, ModelInfo } from '../firestore';
var logger = require('winston');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('errata')
    .setDescription('Demand nerfs/buffs from Wyrd.'),
  async execute(interaction: CommandInteraction) {
    var randomModel: ModelInfo;
    randomModel = modelsInfo.getUniqueCharacters(1)[0];
    let modelName = randomModel.name;

    let op = Math.random() >= .5;
    let opText = op ? "overpowered" : "underpowered";
    let buffText = op ? "nerf" : "buff";

    const text = `@Wyrd, ${modelName} is ${opText}, plz ${buffText}!`;
    await interaction.reply(text);
    if (randomModel) {
      await interaction.editReply({ files: [randomModel.randomImage()] });
    }
  },
};