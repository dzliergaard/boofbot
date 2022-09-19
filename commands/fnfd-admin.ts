// Import the functions you need from the SDKs you need

import { SlashCommandBuilder, SlashCommandSubcommandBuilder } from '@discordjs/builders';
import { ChatInputCommandInteraction } from 'discord.js';
import { unansweredCollection, answeredCollection } from '../firestore';

var logger = require('winston');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('fnfd-admin')
    .setDescription('Admin-only actions on the FNFD question queue.')
    .setDefaultMemberPermissions(0)
    .addSubcommand(new SlashCommandSubcommandBuilder()
      .setName("mark-answered")
      .setDescription("Mark question(s) as answered. Tyrants/owners only.")
      .addIntegerOption(option => option.setName('index')
        .setDescription("Index of the question to mark as answered as returned by `/fnfd list`.")
        .setRequired(true))
      .addBooleanOption(option => option.setName('unmark')
        .setDescription('Set to true to mark an answered question as unanswered.'))
    )
    .addSubcommand(new SlashCommandSubcommandBuilder()
      .setName("delete")
      .setDescription("Banish a question for being stupid.")
      .addIntegerOption(option => option.setName('index')
        .setDescription("Index of the question to banish as returned by `/fnfd list`.")
        .setRequired(true))
    ),
  permissions: [
    {
      id: '722446885423546420',
      type: 1,
      permission: true,
    },
    {
      id: '881371527273144330',
      type: 1,
      permission: true,
    },
    {
      id: '590690199554752523',
      type: 1,
      permission: true,
    },
    {
      id: '590693611151294464',
      type: 1,
      permission: true,
    },
  ],
  async execute(interaction: ChatInputCommandInteraction) {
    logger.info(`Command options: ${JSON.stringify(interaction.options.getSubcommand())}`);
    await interaction.deferReply();
    switch (interaction.options.getSubcommand()) {
      case 'delete':
        _deleteQuestion(interaction);
        break;
      case 'mark-answered':
        _markAnswered(interaction);
        break;
      default:
        interaction.editReply(`Unknown subcommand ${interaction.options.getSubcommand()}`);
        break;
    }
  },
}

async function _deleteQuestion(interaction: ChatInputCommandInteraction) {
  const setUnanswered = interaction.options.getBoolean('unmark') ?? false;

  var query = (setUnanswered ? answeredCollection : unansweredCollection).orderBy('added');
  var result = await query.get();
  const docs = result.docs;
  const inputIndex = interaction.options.getInteger('index');
  const index = inputIndex - 1;

  if (index < 0 || index >= docs.length) {
    await interaction.editReply(`No question index ${inputIndex} in questions list.`)
    return;
  }

  await docs.at(index).ref.delete();

  await interaction.editReply(`Banished ${interaction.options.getInteger('index')} for being a bad question.`);
}

async function _markAnswered(interaction: ChatInputCommandInteraction) {
  const setUnanswered = interaction.options.getBoolean('unmark') ?? false;

  var query = (setUnanswered ? answeredCollection : unansweredCollection).orderBy('added');
  var result = await query.get();
  const docs = result.docs;
  const inputIndex = interaction.options.getInteger('index');
  const index = inputIndex - 1;

  if (index < 0 || index >= docs.length) {
    await interaction.editReply(`No question index ${inputIndex} in questions list.`)
    return;
  }

  var question = docs.at(index);

  const outputCollection = (setUnanswered ? unansweredCollection : answeredCollection);

  await outputCollection.doc().set(question.data());
  await question.ref.delete();

  await interaction.editReply(`Marked question ${inputIndex} as answered.`);

}