const { Server } = require("socket.io");
const client = require("../../index");
const Client = require("../index");
const botName = 'LavaCod';

const prettyMilliseconds = require("pretty-ms");

/**
 * @param {Server} io - Socket.IO server instance
 */
module.exports = (io) => {
  io.on("connection", (socket) => {
    // Handle "index" event
    socket.on("index", () => {
      // Clear previous interval if exists
      if (socket.Index) clearInterval(socket.Index);

      // Start a new interval to emit "index" event every second
      socket.Index = setInterval(() => {
        // Skip if the client is not ready
        if (!Client.Ready) return;

        // Calculate the total in-queue count across all guilds
        Client.InQueue = 0;
        for (var key in Client.guildQueue) {
          Client.InQueue = Client.InQueue + Client.guildQueue[key];
        }

        // Emit "index" event with relevant data
        socket.emit("index", {
          commands: Client.CommandsRan,
          playMusic: Client.MusicPlayed,
          inQueue: Client.InQueue,
          guilds: Client.guilds.cache.size,
          ping: Client.ws.ping,
        });
      }, 1000);
    });

    // Handle "server" event
    socket.on("server", (ServerID) => {
      // Clear previous interval if exists
      if (socket.Server) clearInterval(socket.Server);

      // Start a new interval to emit "server" event every second
      socket.Server = setInterval(async () => {
        // Skip if the client is not ready
        if (!Client.Ready) return;

        // Get the guild by ID
        let Guild = Client.guilds.cache.get(ServerID);
        if (!Guild) {
          // Emit "error" event if the guild is not found
          return socket.emit("error", "Unable to find that server");
        }

        // Retrieve guild data from the database
        let GuildDB = await Client.GetMusic(Guild.id);

        // Get the player for the guild
        let player = Client.manager.get(Guild.id);

        // Prepare the server data to emit
        let serverData = {
          serverName: Guild.name,
          queue: player?.queue ? player.queue.length : 0,
          queueList: player?.queue ? player.queue.slice(0, 10) : [],
          songsLoop: player?.trackRepeat ? "Enabled" : "Disabled",
          queueLoop: player?.queueRepeat ? "Enabled" : "Disabled",
          prefix: GuildDB?.prefix || Client.botconfig.DefaultPrefix,
          maxDuration: player?.queue.current
            ? prettyMilliseconds(player.queue.current.duration, {
              colonNotation: true,
            })
            : false,
          position: player?.queue.current
            ? prettyMilliseconds(player.position, { colonNotation: true })
            : false,
          nowPlaying: player?.queue.current || false,
        };

        // Emit "server" event with the server data
        socket.emit("server", serverData);
      }, 1000);
    });
  });
};