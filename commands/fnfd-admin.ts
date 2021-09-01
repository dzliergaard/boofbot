// Import the functions you need from the SDKs you need

import { SlashCommandBuilder, SlashCommandSubcommandBuilder } from '@discordjs/builders';
import { CommandInteraction } from 'discord.js';
import { unansweredCollection, answeredCollection } from '../firestore';

var logger = require('winston');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('fnfd-admin')
    .setDescription('Admin-only actions on the FNFD question queue.')
    .setDefaultPermission(false)
    .addSubcommand(new SlashCommandSubcommandBuilder()
      .setName("mark-answered")
      .setDescription("Mark question(s) as answered. Tyrants/owners only.")
      .addIntegerOption(option => option.setName('index')
        .setDescription("Index of the question as returned by `/fnfd list`.")
        .setRequired(true))),
  async execute(interaction: CommandInteraction) {
    logger.info(`Command options: ${JSON.stringify(interaction.options.getSubcommand())}`);
    await interaction.deferReply();
    switch (interaction.options.getSubcommand()) {
      case 'mark-answered':
        _markAnswered(interaction);
        break;
      default:
        interaction.editReply(`Unknown subcommand ${interaction.options.getSubcommand()}`);
        break;
    }
  },
  permissions: [
    {
      id: '722446885423546420',
      type: 'ROLE',
      permission: true,
    },
    {
      id: '881371527273144330',
      type: 'ROLE',
      permission: true,
    },
    {
      id: '590690199554752523',
      type: 'ROLE',
      permission: true,
    },
  ],
}

async function _markAnswered(interaction: CommandInteraction) {
  var index = interaction.options.getInteger('index');

  index--;

  var docs = await unansweredCollection.listDocuments();
  if (index < 0 || index >= docs.length) {
    await interaction.editReply(`No question index ${index + 1} in questions list.`)
    return;
  }

  var doc = await docs.at(index).get();
  var question = doc.data();

  await answeredCollection.doc().set(question);
  await docs.at(index).delete();

  await interaction.editReply(`Marked question ${interaction.options.getInteger('index')} as answered.`);
}