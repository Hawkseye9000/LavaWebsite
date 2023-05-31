const { EmbedBuilder } = require("discord.js");

module.exports = {
    "name": "queue",
    "description": "Display the current music queue",
    "usage": "",
    "permissions": {
        "channel": ["VIEW_CHANNEL", "SEND_MESSAGES", "EMBED_LINKS"],
        "member": []
    },
    "aliases": [],
    "category": "music",
    "premium": false,
    "SlashCommand": {
        "run": async (client, interaction) => {
            // Get the guild ID
            const guildId = interaction.guildId;

            // Get the music queue for the guild
            const queue = client.guildQueue[guildId];

            // If the queue is empty, send a message indicating that
            if (!queue || queue.length === 0) {
                await interaction.reply("The music queue is currently empty.");
                return;
            }

            // Build the embed with the queue information
            const embed = new EmbedBuilder()
                .setTitle("Music Queue")
                .setDescription(queue.map((track, index) => `${index + 1}. ${track.title}`).join("\n"))
                .setColor(0x00FF00);

            // Send the embed as the reply
            await interaction.reply({ embeds: [embed] });
        }
    }
};