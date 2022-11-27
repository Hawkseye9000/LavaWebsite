const { Collection } = require('discord.js');
/**
 *
 * @param {import("../library/MusicBot ")} client
 */
module.exports = async (client) => {
  (client.Ready = true),
    client.user.setPresence(client.config.presence);
  client.log("Successfully Logged in as " + client.user.tag);
  client.manager.init(client.user.id);
  client.RegisterSlashCommands();
  client.guilds.cache.forEach(async (data) => {
    client.skipSong[data.id] = false;
    client.skipBy[data.id] = false;

    const firstInvites = await data.invites.fetch();
    // Set the key as Guild ID, and create a map which has the invite code, and the number of uses
    client.invites.set(data.id, new Collection(firstInvites.map((invite) => [invite.code, invite.uses])));
  });
};
