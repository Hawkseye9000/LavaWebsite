const { EmbedBuilder } = require('discord.js');
const Banking = require("../../mongoose/database/schemas/Banking");

module.exports = {
    name: "withdraw",
    description: "Withdraw coins from your bank account",
    usage: "[amount]",
    permissions: {
        channel: ["VIEW_CHANNEL", "SEND_MESSAGES", "EMBED_LINKS"],
        member: [],
    },
    aliases: [],
    category: "banking",
    premium: false,
    SlashCommand: {
        run: async (client, interaction, args) => {
            try {
                // Retrieve the user's balance from the database
                const userBalance = await Banking.findOne({ guildId: interaction.guild.id, userId: interaction.user.id });

                // If the user doesn't have a balance, reply with a message
                if (!userBalance) {
                    return interaction.reply('You don\'t have a bank account yet.');
                }

                // Check if the amount argument is provided
                const amount = parseInt(args[0]);
                if (isNaN(amount) || amount <= 0) {
                    return interaction.reply('Please provide a valid amount to withdraw.');
                }

                // Check if the user has enough coins to withdraw
                if (userBalance.balance < amount) {
                    return interaction.reply('You don\'t have enough coins to withdraw.');
                }

                // Update the user's balance and withdraw the coins
                userBalance.balance -= amount;
                userBalance.withdrawn += amount;
                await userBalance.save();

                // Create an embed with the result message
                const embed = new EmbedBuilder()
                    .setColor(0x0099FF)
                    .setDescription(`You have withdrawn ${amount} from your bank account.\nYour new balance is ${userBalance.balance}.`);

                // Reply to the interaction with the embed
                return interaction.reply({ embeds: [embed] });
            } catch (error) {
                console.error('Error withdrawing coins:', error);
                return interaction.reply('An error occurred while withdrawing coins.');
            }
        }
    }
};