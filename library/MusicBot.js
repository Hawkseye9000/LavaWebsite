const { Client, GatewayIntentBits, Partials, Collection, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');
const ConfigFetcher = require('../config');
const { Server } = require("socket.io");
const http = require("http");
const play = require('../music/play.js');
const fs = require('fs');
const Express = require("express");
const Logger = require("./Logger");
const logger = new Logger();
const GuildConfig = require("../mongoose/database/schemas/GuildConfig");
const { Manager } = require("erela.js");
const Spotify = require("better-erela.js-spotify").default;
const { default: AppleMusic } = require("better-erela.js-apple");
const deezer = require("erela.js-deezer");
const facebook = require("erela.js-facebook");
const mongoose = require('mongoose');
const filters = require("erela.js-filters");

class MusicBot extends Client {

    constructor(
        props = {
            partials: [
                Partials.Channel, // for text channel
                Partials.GuildMember, // for guild member
                Partials.User, // for discord user
            ],
            intents: [
                GatewayIntentBits.Guilds,
                GatewayIntentBits.GuildInvites,
                GatewayIntentBits.GuildMembers,
                GatewayIntentBits.GuildVoiceStates,
                GatewayIntentBits.GuildMessages,
                GatewayIntentBits.MessageContent,
            ],
        }

    ) {
        super(props);

        // Load Config File
        this.config = ConfigFetcher;

        this.musicMessage = [];

        this.skipSong = [];
        this.skipBy = [];
        this.twentyFourSeven = [];

        this.SlashCommands = new Collection();
        this.Commands = new Collection();
        this.MusicPlayed = 0;
        this.CommandsRan = 0;
        this.InQueue = 0;
        this.guildQueue = [];
        this.Buttons = new Collection();
        this.invites = new Collection();

        this.LoadEvents();
        this.LoadButtons();
        this.LoadCommands();

        this.Commands.set('play', play);

        var client = this;

        //creating Web portal
        this.server = Express();
        this.http = http.createServer(this.server);
        this.server.use('/', require('../express'));
        this.io = new Server(this.http);
        require('../express/socket')(this.io);

        // Initiate the Manager with some options and listen to some events.
        this.manager = new Manager({
            autoPlay: true,
            // plugins
            plugins: [
                new deezer(),
                new AppleMusic(),
                new Spotify(),
                new facebook(),
            ],
            autoPlay: true,
            retryDelay: this.config.retryDelay,
            retryAmount: this.config.retryAmount,
            // Pass an array of node.
            nodes: [this.config.lavalink],
            // A send method to send data to the Discord WebSocket using your library.
            // Getting the shard for the guild and sending the data to the WebSocket.
            send(id, payload) {
                const guild = client.guilds.cache.get(id);
                if (guild) guild.shard.send(payload);
            }
        }).on("nodeConnect", node => logger.commands(`Node ${node.options.identifier} connected`))
            .on("nodeError", (node, error) => logger.error(`Node ${node.options.identifier} had an error: ${error.message}`))
            .on("trackStart", (player, track) => {
                this.MusicPlayed++;
                let content;
                const musicMsg = client.musicMessage[player.guild];
                if (player.queue.length == 0)
                    content = `**[ Now Playing ]**\n${track.title}.`;
                else {
                    content = `\n**[ Now Playing ]**\n${track.title}.\n**[ ${player.queue.length} Songs in Queue ]**`;
                    musicMsg.edit({ content: content });
                };
                this.playSong(track.title, player.queue.length);
                this.guildQueue[player.guild] = player.queue.length;
                const musicEmbed = musicMsg.embeds[0];
                const thumbnail = track.thumbnail ? track.thumbnail.replace('default', 'hqdefault') : 'https://c.tenor.com/eDVrPUBkx7AAAAAd/anime-sleepy.gif';
                const msgEmbed = {
                    title: track.title,
                    color: 0xd43790,
                    image: {
                        url: thumbnail,
                    },
                    thumbnail: {
                        url: track.thumbnail,
                    },
                    footer: {
                        text: `🔊 Volume: ${player.volume}`,
                        iconURL: `${client.user.avatarURL()}`,
                    },
                };
                const playEmbed = new EmbedBuilder(msgEmbed);
                playEmbed.addFields({ name: `Requested By`, value: `${track.requester.username}`, inline: true });
                if (client.skipSong[player.guild] && client.skipBy[player.guild]) {
                    playEmbed.addFields({ name: `Skip By`, value: `${client.skipBy[player.guild].username}`, inline: true });
                    client.skipSong[player.guild] = false;
                    client.skipBy[player.guild] = false;
                }
                musicMsg.edit({ content: content, embeds: [playEmbed] });
            })
            .on("queueEnd", (player) => {
                const musicMsg = client.musicMessage[player.guild];
                client.skipSong[player.guild] = false;
                client.skipBy[player.guild] = false;
                client.guildQueue[player.guild] = 0;
                let description = null;
                const embed = {
                    title: `🎵 Vibing Music 🎵`,
                    description: `Few permission have been changed to bot. So kindly please re-invite the awesome bot with new link. Many Thanx \n\n [Invite Link](https://discord.com/oauth2/authorize?client_id=946749028312416327&permissions=277083450689&scope=bot%20applications.commands)`,
                    color: 0xd43790,
                    image: {
                        url: 'https://i.pinimg.com/originals/55/28/82/552882e7f9e8ca8ae79a9cab1f6480d6.gif',
                    },
                    thumbnail: {
                        url: '',
                    },
                    footer: {
                        text: `${client.user.username} Music`,
                        iconURL: `${client.user.avatarURL()}`,
                    },
                };

                const row = new ActionRowBuilder().addComponents([
                    new ButtonBuilder()
                        .setCustomId('pause')
                        .setLabel('⏸️ Pause')
                        .setStyle(ButtonStyle.Primary),
                    new ButtonBuilder()
                        .setCustomId('skip')
                        .setLabel('⏭️ Skip')
                        .setStyle(ButtonStyle.Secondary),
                    new ButtonBuilder()
                        .setCustomId('clear')
                        .setLabel('🗑️ Clear')
                        .setStyle(ButtonStyle.Secondary),
                    new ButtonBuilder()
                        .setCustomId('stop')
                        .setLabel('⏹️ Stop')
                        .setStyle(ButtonStyle.Secondary),
                    new ButtonBuilder()
                        .setCustomId('fix')
                        .setLabel('⚒️ Repair')
                        .setStyle(ButtonStyle.Secondary),
                ]);

                musicMsg.edit({ content: `**[ Nothing Playing ]**\nJoin a voice channel and queue songs by name or url in here.`, embeds: [embed], components: [row] });

                if (!client.twentyFourSeven[player.guild])
                    player.destroy();
            });
    }

    log(Text) {
        logger.log(Text);
    }

    warn(Text) {
        logger.warn(Text);
    }

    error(Text) {
        logger.error(Text);
    }

    playSong(song, queueLength) {
        logger.playSong(song, queueLength);
    }

    LoadEvents() {
        fs.readdir('./events/', async (err, files) => {
            if (err) return console.error(err);
            files.forEach(file => {
                if (!file.endsWith('.js')) return;
                const evt = require(`../events/${file}`);
                let evtName = file.split('.')[0];
                this.on(evtName, evt.bind(null, this));
                logger.events(`Loaded event '${evtName}'`);
            });
        });
    }

    LoadButtons() {
        fs.readdir('./buttons/', async (err, files) => {
            if (err) return console.error(err);
            files.forEach(file => {
                if (!file.endsWith('.js')) return;
                const button = require(`../buttons/${file}`)
                let btnName = file.split('.')[0];
                this.Buttons.set(btnName, button);
                logger.log(`Loaded button '${btnName}'`);
            });
        });
    }

    LoadCommands() {
        const categories = fs.readdirSync(__dirname + '/../commands/');
        categories.filter((cat) => !cat.endsWith('.js')).forEach((cat) => {
            const files = fs.readdirSync(__dirname + `/../commands/${cat}/`).filter((f) =>
                f.endsWith('.js')
            );
            files.forEach((file) => {
                let cmd = require(__dirname + `/../commands/${cat}/` + file);
                if (!cmd.name || !cmd.description || !cmd.SlashCommand) {
                    return this.warn(`unable to load command: ${file.split(".")[0]}, Reason: File doesn't had run/name/desciption`);
                }
                let cmdName = cmd.name.toLowerCase();
                this.Commands.set(cmdName, cmd);
                logger.commands(`Loaded command '${cmdName}'`);
            })
        });
    }

    build() {
        this.warn('Getting Ready....');
        this.login(this.config.Token);
        if (this.config.ExpressServer) {
            this.warn('Server is starting');
            this.log('Server started...');
            this.http.listen(this.config.httpPort, () =>
                this.log(`Web HTTP Server has been started at ${this.config.httpPort}`)
            );
        }

        this.MongooseConnect();
    }

    RegisterSlashCommands() {
        require("./SlashCommand")(this);
    }

    DeRegisterGlobalSlashCommands() {
        require("./DeRegisterSlashGlobalCommands")(this);
    }

    DeRegisterGuildSlashCommands() {
        this.guilds.cache.forEach((guild) => {
            require("./DeRegisterSlashGuildCommands")(this, guild.id);
        });
    }

    MongooseConnect() {
        mongoose.connect(this.config.mongooseURL, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        })
            .then(data => {
                this.warn(`Connected to ${data.connection.host}:${data.connection.port} database: ${data.connection.name}`);
            })
            .catch(err => { this.warn(err) });
    }

    GetMusic(GuildID) {
        return new Promise(async (res, rej) => {
            const findGuildConfig = await GuildConfig.findOne({ guildId: GuildID });
            res(findGuildConfig);
        });
    }

}

module.exports = MusicBot;