require('dotenv').config();
const { ActivityType } = require("discord.js");

module.exports = {
    Id: process.env.Discord_ClientID,
    prefix: process.env.PREFIX || '!',
    Admins: ["UserID", "UserID"],
    buildToken: process.env.BUILD_TOKEN || 'build token',
    Token: process.env.TOKEN || 'bot token',
    ExpressServer: true,
    httpPort: process.env.HTTP_PORT || 'need port',
    httpsPort: process.env.HTTPS_PORT || '443',
    CallbackURL: process.env.CALLBACK_URL || '',

    mongooseURL: process.env.MONGOOSE_URL || "",

    RateLimitWindowMS: 15,
    RateLimitDelayAfter: 30,
    MaxUsesPerUser: Infinity,
    RateLimitDelayMs: 100,

    // lavalink server
    lavalink: [
        // {
        //     id: "ryisgood",
        //     host: '149.56.23.207',
        //     port: 1311,
        //     password: 'lalalink',
        //     secure: false,
        // },
        // {
        //     id: "Darren",
        //     host: 'narco.buses.rocks',
        //     port: 2269,
        //     password: 'glasshost1984',
        //     secure: false,
        // },
        {
            id: "DevamOP",
            host: 'lavalink.devamop.in',
            port: 80,
            password: 'DevamOP',
            secure: false,
        }
    ],

    presence: {
        status: "idle", // online, idle, and dnd(invisible too but it make people think the bot is offline)
        activities: [
            {
                name: "Music", //Status Text
                type: ActivityType.Playing, // PLAYING, WATCHING, LISTENING, STREAMING
            },
        ],
    },

    Spotify: {
        ClientID: process.env.Spotify_ClientID || "", //Spotify Client ID
        ClientSecret: process.env.Spotify_ClientSecret || "", //Spotify Client Secret
    },

};