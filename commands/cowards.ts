import { SlashCommandBuilder } from '@discordjs/builders';
import { CommandInteraction } from 'discord.js';
import { modelsInfo, random, ModelInfo } from '../firestore';
var logger = require('winston');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('cowards')
    .setDescription('Demand satisfaction from Wyrd.')
    .addStringOption((option) =>
      option.setName("model")
        .setDescription("Optionally choose a model, person, or anything.")
        .setRequired(false))
    .addStringOption((option) =>
      option.setName("keyword")
        .setDescription("Optionally choose a keyword.")
        .setRequired(false)
    ),
  async execute(interaction: CommandInteraction) {
    const inputModel = interaction.options.getString("model");
    const inputKeyword = interaction.options.getString("keyword");

    var randomModel: ModelInfo;
    var modelName = inputModel;
    if (!modelName) {
      randomModel = modelsInfo.getUniqueCharacters(1)[0];
      modelName = randomModel.name;
    }

    var keyword = inputKeyword ?? random(modelsInfo.keywords);

    if (randomModel) {
      if (randomModel.keywords) {
        var i = 0;
        while (randomModel.keywords.indexOf(keyword) >= 0 && i++ < 10) {
          keyword = random(modelsInfo.keywords);
        }
      }
      if (i == 10) {
        logger.error(`Can't seem to find a keyword for ${modelName} that isn't in ${randomModel.keywords}`);
        await interaction.reply(`Can't seem to find a keyword for ${modelName} that isn't in ${randomModel.keywords}`);
        return;
      }
    }

    const text = `Give ${modelName} the ${keyword} keyword you Cowards!`;
    await interaction.reply(text);
    if (randomModel) {
      await interaction.editReply({ files: [randomModel.randomImage()] });
    }
  },
};