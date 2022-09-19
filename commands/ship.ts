import { SlashCommandBuilder } from '@discordjs/builders';
import { ChatInputCommandInteraction } from 'discord.js';
import { modelsInfo } from '../firestore';
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
  async execute(interaction: ChatInputCommandInteraction) {
    var charOne = interaction.options.getString("personone");
    const getCharacters = charOne ? 1 : 2;
    const characters = modelsInfo.getUniqueCharacters(getCharacters, true);
    const names = [];
    if (charOne) {
      names.push(charOne);
    }
    characters.forEach((character) => names.push(character.name));

    var emoji = '♥'
    if (Math.random() < .3) {
      emoji = '🍆';
    }
    const text = `${_randomIntro()}\n${names[0]} ${emoji} ${names[1]}`;
    await interaction.reply(text);

    const fileNames = characters.map((character) => character.randomImage());
    if (fileNames.length == 0) {
      return;
    }

    interaction.editReply({ files: fileNames });
  },
};