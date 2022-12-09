const { EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require("discord.js");
const fetch = require('node-fetch');
const GuildConfig = require("../../mongoose/database/schemas/GuildConfig");

module.exports = {
  name: "setup",
  description: "setup your music channel",
  usage: "",
  permissions: {
    channel: ["VIEW_CHANNEL", "SEND_MESSAGES", "EMBED_LINKS"],
    member: [],
  },
  aliases: [],
  category: "music",
  SlashCommand: {
    options: [
      {
        name: "channel",
        description: "Select channel to setup music",
        value: "command",
        type: 7,
        required: true,
      },
    ],
    /**
     *
     * @param {import("../structures/DiscordMusicBot")} client
     * @param {import("discord.js").Message} message
     * @param {string[]} args
     * @param {*} param3
     */
    run: async (client, interaction, args, { MusicDB }) => {
      if (!interaction.member.permissions.has('MANAGE_GUILD')) return interaction.reply(`you dont have manage guild permission to run this command`).catch(err => { client.error(err) });
      const music_channel = args.channel;
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
          .setCustomId('loop')
          .setLabel('🔁 Loop')
          .setStyle(ButtonStyle.Danger),
        new ButtonBuilder()
          .setCustomId('stop')
          .setLabel('⏹️ Stop')
          .setStyle(ButtonStyle.Secondary),
        new ButtonBuilder()
          .setCustomId('fix')
          .setLabel('⚒️ Repair')
          .setStyle(ButtonStyle.Secondary),
      ]);

      const row1 = new ActionRowBuilder().addComponents([
        new ButtonBuilder()
          .setCustomId('summon')
          .setLabel('⚡ Summon')
          .setStyle(ButtonStyle.Secondary),
        new ButtonBuilder()
          .setCustomId('queuelist')
          .setLabel('🧾 Queue List')
          .setStyle(ButtonStyle.Secondary),
        new ButtonBuilder()
          .setCustomId('clear')
          .setLabel('🗑️ Clear')
          .setStyle(ButtonStyle.Secondary),
        new ButtonBuilder()
          .setCustomId('grab')
          .setLabel('🎣 Grab')
          .setStyle(ButtonStyle.Secondary),
        new ButtonBuilder()
          .setCustomId('stats')
          .setLabel('👾 Stats')
          .setStyle(ButtonStyle.Secondary),
      ]);

      music_channel.send({ content: `**[ Nothing Playing ]**\nJoin a voice channel and queue songs by name or url in here.`, embeds: [embed], components: [row, row1] })
        .then(async (data) => {
          const channelId = music_channel.id;
          const messageId = data.id;
          await GuildConfig.findOneAndUpdate({ guildId: MusicDB.guildId }, {
            musicChannelId: channelId,
            musicMessageId: messageId
          });
        });
      return interaction.reply(`setup complete`).catch(err => { client.error(err) });
    },
  },
};
