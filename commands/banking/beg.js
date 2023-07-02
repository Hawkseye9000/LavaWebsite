const { EmbedBuilder } = require('discord.js');
const Banking = require("../../mongoose/database/schemas/Banking");

module.exports = {
    name: "beg",
    description: "Beg for some coins",
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

                // Generate a random amount of coins to give
                const coins = Math.floor(Math.random() * 100) + 1;

                // Update the user's balance by adding the coins
                userBalance.balance += coins;
                await userBalance.save();

                // Create an embed with the result message
                const embed = new EmbedBuilder()
                    .setColor(0x0099FF)
                    .setDescription(`You've begged and received ${"⌘"} ${coins} coins!\nYour new balance is ${"⌘"} ${userBalance.balance}`);

                // Reply to the interaction with the embed
                return interaction.reply({ embeds: [embed] });
            } catch (error) {
                console.error('Error begging for coins:', error);
                return interaction.reply('An error occurred while begging for coins.');
            }
        }
    }
};