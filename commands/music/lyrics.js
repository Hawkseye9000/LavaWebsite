const search = require('lyrics-searcher-musixmatch').default;

module.exports = {
    name: 'lyrics',
    description: 'Get the current playing song lyrics',
    usage: '',
    permissions: {
        channel: ['VIEW_CHANNEL', 'SEND_MESSAGES', 'EMBED_LINKS'],
        member: [],
    },
    aliases: [],
    category: 'music',
    premium: false,
    SlashCommand: {
        run: async (client, interaction, args, { MusicDB }) => {
            let channel = interaction.channel;
            if (!channel) return;

            let player;
            if (client.manager) player = await client.manager.get(interaction.guildId);
            else return interaction.reply({ content: 'Lavalink node is not connected' }).catch(err => {
                client.error(err);
            });

            if (!player) return interaction.reply({ content: 'There are no songs in the queue.' }).catch(err => {
                client.error(err);
            });

            try {
                const searchResult = await search(player.queue.current.title);
                if (searchResult && searchResult.lyrics) {
                    return interaction.reply({ content: searchResult.lyrics }).catch(err => {
                        client.error(err);
                    });
                } else {
                    return interaction.reply({ content: 'Cannot find lyrics' }).catch(err => {
                        client.error(err);
                    });
                }
            } catch (err) {
                client.error(err);
                return interaction.reply({ content: 'An error occurred while fetching lyrics' }).catch(err => {
                    client.error(err);
                });
            }
        },
    },
};
