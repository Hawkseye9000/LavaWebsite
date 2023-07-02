const { EmbedBuilder } = require('discord.js');
const Banking = require("../../mongoose/database/schemas/Banking");

module.exports = {
    name: "balance",
    description: "Get your bank account balance",
    usage: "",
    permissions: {
        channel: ["VIEW_CHANNEL", "SEND_MESSAGES", "EMBED_LINKS"],
        member: [],
    },
    aliases: [],
    category: "banking",
    premium: false,
    SlashCommand: {
        run: async (client, interaction) => {
            try {
                // Retrieve the user's balance from the database
                const userBalance = await Banking.findOne({ guildId: interaction.guild.id, userId: interaction.user.id });

                // If the user doesn't have a balance, reply with a message
                if (!userBalance) {
                    return interaction.reply('You don\'t have a bank account yet.');
                }

                // Create an embed with the balance information
                const embed = new EmbedBuilder()
                    .setColor(0x0099FF)
                    .setDescription(`Your balance is ${"⌘"} ${userBalance.balance}`);

                // Reply to the interaction with the embed
                return interaction.reply({ embeds: [embed] });
            } catch (error) {
                console.error('Error retrieving balance:', error);
                return interaction.reply('An error occurred while retrieving your balance.');
            }
        }
    }
};