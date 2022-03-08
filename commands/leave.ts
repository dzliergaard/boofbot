import { SlashCommandBuilder } from '@discordjs/builders';
import { CommandInteraction } from 'discord.js';

module.exports = {
  data: new SlashCommandBuilder()
    .setName('leave')
    .setDescription('Use this if they start doing fucking cow puns again.'),
  async execute(interaction: CommandInteraction) {
    var text = `<@!${interaction.user.id}> has left the conversation.`;

    await interaction.reply(text);
  },
};