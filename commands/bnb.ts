import { SlashCommandBuilder } from '@discordjs/builders';
import { CommandInteraction } from 'discord.js';
var logger = require('winston');

const nameParts = {
  "bene": {
    "A": "Baba",
    "B": "Bene",
    "C": "Bocki",
    "D": "Buddi",
    "E": "Bebe",
    "F": "Biffle",
    "G": "Bugi",
    "H": "Honi",
    "I": "Bibi",
    "J": "Jabber",
    "K": "Becki",
    "L": "Buli",
    "M": "Bummi",
    "N": "Bono",
    "O": "Bobo",
    "P": "Bipi",
    "Q": "Boqui",
    "R": "Bori",
    "S": "Bissi",
    "T": "Booti",
    "U": "Bubu",
    "V": "Bovi",
    "W": "Bowi",
    "X": "Boxi",
    "Y": "Boyo",
    "Z": "Bozi"
  },
  "dict": {
    "A": "dact",
    "B": "bect",
    "C": "cash",
    "D": "dent",
    "E": "deep",
    "F": "fuct",
    "G": "gapt",
    "H": "hunt",
    "I": "dint",
    "J": "jack",
    "K": "koop",
    "L": "lect",
    "M": "mint",
    "N": "nurt",
    "O": "doot",
    "P": "pat",
    "Q": "quop",
    "R": "rect",
    "S": "spit",
    "T": "dict",
    "U": "dupp",
    "V": "vent",
    "W": "wept",
    "X": "dex",
    "Y": "yack",
    "Z": "zil"
  },
  "cumber": {
    "A": "Amble",
    "B": "Bubble",
    "C": "Cumber",
    "D": "Doober",
    "E": "Eeple",
    "F": "Fengle",
    "G": "Gumble",
    "H": "Haggle",
    "I": "Iggle",
    "J": "Jangle",
    "K": "Kooti",
    "L": "Limber",
    "M": "Maybe",
    "N": "Nani",
    "O": "Oobi",
    "P": "Pucker",
    "Q": "Quiggle",
    "R": "Rumple",
    "S": "Sissy",
    "T": "Tooty",
    "U": "Utter",
    "V": "Vangle",
    "W": "Whipple",
    "X": "Xexi",
    "Y": "Yabble",
    "Z": "Ziggy"
  },
  "batch": {
    "A": "band",
    "B": "bench",
    "C": "crotch",
    "D": "dutch",
    "E": "wept",
    "F": "flinch",
    "G": "grits",
    "H": "batch",
    "I": "bitch",
    "J": "jinx",
    "K": "klutz",
    "L": "latch",
    "M": "munch",
    "N": "nuts",
    "O": "goose",
    "P": "patch",
    "Q": "quits",
    "R": "retch",
    "S": "stitch",
    "T": "trex",
    "U": "bunt",
    "V": "vox",
    "W": "wench",
    "X": "box",
    "Y": "yeets",
    "Z": "zilch"
  },
};

module.exports = {
  data: new SlashCommandBuilder()
    .setName('benedict-nameabitch')
    .setDescription('Calculate your Benedict Cumberbatch name.')
    .addStringOption((option) =>
      option.setName("first-name")
        .setDescription("Your first name.")
        .setRequired(true))
    .addStringOption((option) =>
      option.setName("last-name")
        .setDescription("Your last name.")
        .setRequired(true)
    ),
  async execute(interaction: CommandInteraction) {
    const firstName = interaction.options.getString("first-name").trim().toUpperCase();
    const lastName = interaction.options.getString("last-name").trim().toUpperCase();

    const trimmedFirstName = firstName.replace(/[^A-Z]/g, '');
    const trimmedLastName = lastName.replace(/[^A-Z]/g, '');

    if (trimmedFirstName.length < 2 || trimmedLastName.length < 2) {
      interaction.reply("Get a better name.");
      return;
    }

    var bene = nameParts["bene"][trimmedFirstName.charAt(0)];
    var dict = nameParts["dict"][trimmedFirstName.charAt(trimmedFirstName.length - 1)];
    var cumber = nameParts["cumber"][trimmedLastName.charAt(0)];
    var batch = nameParts["batch"][trimmedLastName.charAt(trimmedLastName.length - 1)];

    const text = `You are ${bene}${dict} ${cumber}${batch}`;

    interaction.reply(text);
  },
};