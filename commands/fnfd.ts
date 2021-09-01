// Import the functions you need from the SDKs you need
import { SlashCommandBuilder, SlashCommandSubcommandBuilder, blockQuote } from '@discordjs/builders';
import { CommandInteraction } from 'discord.js';
import { unansweredCollection } from '../firestore';


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
      .setDescription("Add a question for the next FNFD!")),
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
  };
  await unansweredCollection.doc().set(questionsData).catch((error) => {
    logger.info(`Error executing document update: ${error}`);
    throw error;
  });
  await interaction.editReply(`${interaction.user.username} added question: ${questionsData.text}!`)
}

async function _listQuestions(interaction: CommandInteraction) {
  const docs = await unansweredCollection.listDocuments();
  var output = "Here are the current unanswered questions:\n";
  if (docs.length == 0) {

    await interaction.editReply("There are no unanswered questions.");
    return;
  }
  var index = 1;
  for (var doc of docs) {
    var question = (await doc.get()).data()
    output += `\n${index++}: ${question.addedBy?.name} asked: \`${question.text}\``;
  }

  await interaction.editReply(output);
}
