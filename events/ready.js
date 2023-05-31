const { Collection } = require('discord.js');

/**
 * @param {import("../library/MusicBot")} client
 */
module.exports = async (client) => {
  client.Ready = true;
  client.user.setPresence(client.config.presence);
  client.log("Successfully logged in as " + client.user.tag);
  client.manager.init(client.user.id);
  // await client.DeRegisterGlobalSlashCommands();
  // await client.DeRegisterGuildSlashCommands();
  await client.RegisterSlashCommands();

  client.guilds.cache.forEach((guild) => {
    client.skipSong[guild.id] = false;
    client.skipBy[guild.id] = false;
    client.twentyFourSeven[guild.id] = false;
  });
};
