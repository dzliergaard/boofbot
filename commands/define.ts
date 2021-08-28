import { SlashCommandBuilder } from '@discordjs/builders';
import { BaseCommandInteraction, Message } from 'discord.js';
var logger = require('winston');

const booflink = "https://www.urbandictionary.com/define.php?term=Boof";

module.exports = {
  data: new SlashCommandBuilder()
    .setName('defineboof')
    .setDescription('Defines "boof".'),
  async execute(interaction: BaseCommandInteraction) {
    var text = `<@!${interaction.user.id}>  would very much like you to know: ${booflink}`;

    await interaction.reply(text);
  },
  // async devExecute(interaction: BaseCommandInteraction) {
  // }
};