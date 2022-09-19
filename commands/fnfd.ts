// Import the functions you need from the SDKs you need
import { SlashCommandBuilder, SlashCommandSubcommandBuilder } from '@discordjs/builders';
import { ActionRowBuilder, ButtonBuilder, ButtonStyle, ChatInputCommandInteraction } from 'discord.js';
import { answeredCollection, unansweredCollection } from '../firestore';


var logger = require('winston');

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration

module.exports = {
  data: new SlashCommandBuilder()
    .setName('fnfd')
    .setDescription('Add or see questions for the next FNFD.')
    .addSubcommand(new SlashCommandSubcommandBuilder()
      .setName("add")
      .setDescription("Add a question for the next FNFD!")
      .addStringOption(option =>
        option.setName('question')
          .setDescription('The question to add.')
          .setRequired(true)
      ))
    .addSubcommand(new SlashCommandSubcommandBuilder()
      .setName("list")
      .setDescription("Add a question for the next FNFD!")
      .addBooleanOption(option =>
        option.setName("answered")
          .setDescription("Return answered questions instead of unanswered.")
          .setRequired(false))),
  async execute(interaction: ChatInputCommandInteraction) {
    logger.info(`Command interaction: ${JSON.stringify(interaction.options.getSubcommand())}`);
    await interaction.deferReply();
    switch (interaction.options.getSubcommand()) {
      case 'list':
        _listQuestions(interaction);
        break;
      case 'add':
        _addQuestion(interaction);
        break;
      default:
        interaction.editReply(`Unknown subcommand ${interaction.options.getSubcommand()}`);
        break;
    }
  },
};

async function _addQuestion(interaction: ChatInputCommandInteraction) {
  var questionsData = {
    text: interaction.options.getMember('question'),
    addedBy: {
      name: interaction.user.username,
      id: interaction.user.id,
    },
    added: new Date(),
  };
  await unansweredCollection.doc().set(questionsData).catch((error) => {
    logger.info(`Error executing document update: ${error}`);
    throw error;
  });
  await interaction.editReply(`${interaction.user.username} added question: ${questionsData.text}`)
}

async function _listQuestions(interaction: ChatInputCommandInteraction) {
  const getAnswered = interaction.options.getBoolean('answered');
  const query = (getAnswered ? answeredCollection : unansweredCollection).orderBy('added');
  const result = await query.get();
  const docs = result.docs;
  var answeredText = getAnswered ? "answered" : "current unanswered";
  await interaction.editReply(`Here are the ${answeredText} questions:\n`);
  if (docs.length == 0) {
    await interaction.editReply(`There are no ${answeredText} questions.`);
    return;
  }
  var index = 1;
  var output = "";
  var groupCount = 0;
  var answerRow = new ActionRowBuilder<ButtonBuilder>();
  var deleteRow = new ActionRowBuilder<ButtonBuilder>();
  for (var doc of docs) {
    var question = doc.data()
    var questionText = `\n${index}: ${question.addedBy?.name} asked: \`${question.text}\``;
    if (output.length + questionText.length > 2000 || groupCount >= 5) {
      await interaction.followUp({ content: output, components: [answerRow, deleteRow] });
      output = "";
      groupCount = 0;
      answerRow = new ActionRowBuilder<ButtonBuilder>();
      deleteRow = new ActionRowBuilder<ButtonBuilder>();
    }
    output += questionText;
    answerRow.addComponents(
      new ButtonBuilder({
        custom_id: `answer-${doc.id}`,
        label: `☑️ #${index}`,
        style: ButtonStyle.Primary,
      }),
    );
    deleteRow.addComponents(
      new ButtonBuilder({
        custom_id: `delete-${doc.id}`,
        label: `🗑️ #${index}`,
        style: ButtonStyle.Danger,
      }));
    groupCount++;
    index++;
  }

  if (output.length > 0) {
    await interaction.followUp({
      content: output,
      components: [answerRow, deleteRow]
    });

  }
}
