require('dotenv').config();

export const clientID = process.env.CLIENTID;
export const isDev = !!process.env.IS_DEV;
export const guildID = isDev ? process.env.DEV_GUILDID : process.env.GUILDID;
export const token = process.env.TOKEN;

console.log(`Using ${guildID} in ${isDev ? 'dev' : 'prod'}`);
module.exports = {
  clientID: clientID,
  guildID: guildID,
  isDev: isDev,
  token: token,
};