const { EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require("discord.js");

module.exports = {
    name: 'queue',
    description: 'Can check Songs queue list',
    usage: "",
    permissions: {
        channel: ["VIEW_CHANNEL", "SEND_MESSAGES", "EMBED_LINKS"],
        member: [],
    },
    aliases: [],
    category: "music",
    SlashCommand: {
        run: async (client, interaction, args, { MusicDB }) => {
            let channel = interaction.channel;
            if (!channel) return;

            let player;
            if (client.manager) player = await client.manager.get(interaction.guildId);
            else return interaction.reply({ content: `Lavalink node is not connected` }).catch(err => { client.error(err) });

            if (!player) return interaction.reply({ content: `There are no songs in the queue.` }).catch(err => { client.error(err) });
        }
    }
};