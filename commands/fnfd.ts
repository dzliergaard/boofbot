// Import the functions you need from the SDKs you need
import { SlashCommandBuilder, SlashCommandSubcommandBuilder, blockQuote } from '@discordjs/builders';
import { CommandInteraction } from 'discord.js';
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
  async execute(interaction: CommandInteraction) {
    logger.info(`Command options: ${JSON.stringify(interaction.options.getSubcommand())}`);
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

async function _addQuestion(interaction: CommandInteraction) {
  var questionsData = {
    text: interaction.options.getString('question'),
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

async function _listQuestions(interaction: CommandInteraction) {
  var getAnswered = interaction.options.getBoolean('answered');
  var query = (getAnswered ? answeredCollection : unansweredCollection).orderBy('added');
  var result = await query.get();
  const docs = result.docs;
  var answeredText = getAnswered ? "answered" : "current unanswered";
  var output = `Here are the ${answeredText} questions:\n`;
  if (docs.length == 0) {
    await interaction.editReply(`There are no ${answeredText} questions.`);
    return;
  }
  var index = 1;
  for (var doc of docs) {
    var question = doc.data()
    var questionText = `\n${index++}: ${question.addedBy?.name} asked: \`${question.text}\``;
    if (output.length + questionText.length > 2000) {
      await interaction.followUp(output);
      output = "";
    }
    output += questionText;
  }

  if (output.length > 0) {
    await interaction.followUp(output);
  }
}
