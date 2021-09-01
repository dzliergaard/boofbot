import { SlashCommandBuilder } from '@discordjs/builders';
import { CommandInteraction } from 'discord.js';
import { hyperlink } from '@discordjs/builders';
var logger = require('winston');

const boofurl = "https://www.urbandictionary.com/define.php?term=Boof";

module.exports = {
  data: new SlashCommandBuilder()
    .setName('defineboof')
    .setDescription('Defines "boof".'),
  async execute(interaction: CommandInteraction) {
    var booflink = hyperlink("boof", boofurl);
    logger.info(`Booflink: ${booflink}`);
    var text = `<@!${interaction.user.id}>  would very much like you to know: ${booflink}`;

    await interaction.reply(text);
  },
  // async devExecute(interaction: CommandInteraction) {
  // }
};