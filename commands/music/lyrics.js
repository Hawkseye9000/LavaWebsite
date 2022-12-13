const { EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require("discord.js");
const search = require('lyrics-searcher-musixmatch').default;

module.exports = {
    name: 'lyrics',
    description: 'Get the current playing song lyrics',
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

            // return console.log(player.queue.current);

            var lyrics;

            await search(player.queue.current.title).then(data => {
                lyrics = data.lyrics;
                return interaction.reply({ content: `${lyrics}` }).catch(err => { client.error(err) });
            });

            return interaction.reply({ content: `Cann't find lyrics` }).catch(err => { client.error(err) });
        }
    }
};