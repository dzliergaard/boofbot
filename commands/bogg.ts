import { SlashCommandBuilder } from '@discordjs/builders';
import axios from 'axios';
import { CommandInteraction } from 'discord.js';
var logger = require('winston');

const searchUrlBase = "https://www.google.com/search?q=florida+man&tbm=nws&start=";
const titleMatcher: RegExp = /div class="[\w ]*">((?:[^<>]*)Florida [Mm]an(?:[^<>]*))<\/div/g;

var currentResults: Array<string> = [];

function htmlHtmlString(str: string) {
  return str.replace(/&#([0-9]{1,4});/gi, (_, numStr) => {
    var num = parseInt(numStr, 10); // read num as normal number
    return String.fromCharCode(num);
  });
}

const getSearchResults: () => Promise<void> = async () => {
  const index = Math.floor(Math.random() * 10) * 10;

  let searchUrl = searchUrlBase + `${index}`;
  logger.info(`Fetching ${searchUrl}`)
  await axios.get(searchUrl).then(async (res) => {
    let text = htmlHtmlString(res.data);
    let titleMatches = [...text.matchAll(titleMatcher)];
    if (titleMatches == null) {
      logger.warn(`Found no title matches in text ${text}`);
      return;
    }
    titleMatches.forEach((match: RegExpMatchArray) => {
      if (!match[1]) {
        return;
      }
      if (match[1].toLowerCase().indexOf("florida man") < 0) {
        logger.warn(`No 'Florida Man' found in title ${match[1]}`);
      }
      var title = match[1].toLowerCase().replace(/( a )?florida man/, "**Uncle Bogg**");
      currentResults.push(title);
    });

    return;
  });
};

module.exports = {
  data: new SlashCommandBuilder()
    .setName('bogg')
    .setDescription('What\'s Uncle Bogg up to?'),
  async execute(interaction: CommandInteraction) {
    var tries = 0;

    while (tries++ < 10) {
      if (currentResults.length == 0) {
        await getSearchResults();
      }
      if (currentResults.length == 0) {
        return interaction.reply("Nothing right now, try again later.");
      }

      let resInd = Math.floor(Math.random() * currentResults.length);
      let result: string = currentResults.splice(resInd, 1)[0];
      return interaction.reply(result);
    }
    logger.warn(`Could not find appropriate title after 10 attempts.`);
    return await interaction.reply("Nothing now, try again later.");
  },
};