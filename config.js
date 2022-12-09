require('dotenv').config();

module.exports = {
    Id: process.env.Discord_ClientID,
    prefix: process.env.PREFIX || '!',
    Admins: ["UserID", "UserID"],
    buildToken: process.env.BUILD_TOKEN || 'build token',
    Token: process.env.TOKEN || 'bot token',
    ExpressServer: false,
    httpPort: process.env.HTTP_PORT || 'need port',
    httpsPort: process.env.HTTPS_PORT || '443',
    CallbackURL: process.env.CALLBACK_URL || '',

    mongooseURL: process.env.MONGOOSE_URL || "",

    // lavalink server
    lavalink: {
        id: "KartaDharta",
        host: '140.238.226.251',
        port: 3000,
        password: 'lavaserver',
        secure: false,
    },

    presence: {
        status: "idle", // online, idle, and dnd(invisible too but it make people think the bot is offline)
        activities: [
            {
                name: "Server", //Status Text
                type: "WATCHING", // PLAYING, WATCHING, LISTENING, STREAMING
            },
        ],
    },

    Spotify: {
        ClientID: process.env.Spotify_ClientID || "", //Spotify Client ID
        ClientSecret: process.env.Spotify_ClientSecret || "", //Spotify Client Secret
    },

};