const { EmbedBuilder } = require('discord.js');
const Banking = require("../../mongoose/database/schemas/Banking");

module.exports = {
    name: "daily",
    description: "Claim your daily coins",
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

                // Check if the user has claimed their daily coins already
                const lastClaim = userBalance.lastDailyClaim;
                const oneDay = 24 * 60 * 60 * 1000; // 24 hours in milliseconds
                if (lastClaim && Date.now() - lastClaim.getTime() < oneDay) {
                    const remainingTime = new Date(oneDay - (Date.now() - lastClaim.getTime()));
                    return interaction.reply(`You have already claimed your daily coins. Please try again in ${remainingTime.getUTCHours()} hours and ${remainingTime.getUTCMinutes()} minutes.`);
                }

                // Generate a random amount of coins for the daily reward
                const dailyCoins = Math.floor(Math.random() * 100) + 1;

                // Update the user's balance by adding the daily coins
                userBalance.balance += dailyCoins;
                userBalance.lastDailyClaim = Date.now();
                await userBalance.save();

                // Create an embed with the result message
                const embed = new EmbedBuilder()
                    .setColor(0x0099FF)
                    .setDescription(`You claimed your daily reward of ${"⌘"} ${dailyCoins}!\nYour new balance is ${"⌘"} ${userBalance.balance}.`);

                // Reply to the interaction with the embed
                return interaction.reply({ embeds: [embed] });
            } catch (error) {
                console.error('Error claiming daily coins:', error);
                return interaction.reply('An error occurred while claiming your daily coins.');
            }
        }
    }
};