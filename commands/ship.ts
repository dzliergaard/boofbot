import { SlashCommandBuilder } from '@discordjs/builders';
import { CommandInteraction } from 'discord.js';
import { shipCharacters } from '../firestore';
import { ref, getDownloadURL } from "firebase/storage";
var logger = require('winston');

const intros = [
  "Ship 'em",
  "OTP",
  "No one asked for",
  "We all want to see",
  "Destined for each other",
  "You always knew",
  "How about",
  "My fanfic is about",
  "What if...",
  "Explain this:",
  "Hawt",
  "Shipping approved:",
  "Wholesome",
  "Will they, won't they?",
  "Ross and Rachel. Jim and Pam.",
];

function _randomIntro() {
  return intros[Math.floor(Math.random() * intros.length)];
}

module.exports = {
  data: new SlashCommandBuilder()
    .setName('ship')
    .setDescription('Generates a random Ship.')
    .addStringOption((option) =>
      option.setName("personone")
        .setDescription("Optionally select the first character.")
        .setRequired(false)
    ),
  async execute(interaction: CommandInteraction) {
    var options = Object.keys(shipCharacters);
    var count = options.length;
    var charOne = interaction.options.getString("personone");
    var indOne = -1;
    if (!charOne) {
      indOne = Math.floor((Math.random() * count));
      charOne = options[indOne];
    }
    var indTwo = indOne;
    var charTwo = charOne;
    while (charOne == charTwo) {
      indTwo = Math.floor((Math.random() * count));
      charTwo = options[indTwo];
    }

    var emoji = '♥'
    if (Math.random() < .3) {
      emoji = '🍆';
    }
    var text = `${_randomIntro()}\n${charOne} ${emoji} ${charTwo}`;
    await interaction.reply(text);

    var fileNames = [];
    if (shipCharacters[charOne]) {
      fileNames.push(shipCharacters[charOne]);
    }
    if (shipCharacters[charTwo]) {
      fileNames.push(shipCharacters[charTwo]);
    }
    if (fileNames.length == 0) {
      return;
    }

    interaction.editReply({ files: fileNames });
  },
};