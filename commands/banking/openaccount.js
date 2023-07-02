const { EmbedBuilder } = require('discord.js');
const Banking = require("../../mongoose/database/schemas/Banking");

module.exports = {
    name: "openaccount",
    description: "Open a bank account",
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
                // Check if the user already has a bank account
                const existingAccount = await Banking.findOne({ guildId: interaction.guild.id, userId: interaction.user.id });
                if (existingAccount) {
                    return interaction.reply('You already have a bank account.');
                }

                // Create a new bank account for the user
                const newAccount = new Banking({
                    guildId: interaction.guild.id,
                    userId: interaction.user.id,
                    balance: 0
                });
                await newAccount.save();

                // Create an embed with the success message
                const embed = new EmbedBuilder()
                    .setColor(0x0099FF)
                    .setDescription('Congratulations! Your bank account has been opened.');

                // Reply to the interaction with the embed
                return interaction.reply({ embeds: [embed] });
            } catch (error) {
                console.error('Error opening bank account:', error);
                return interaction.reply('An error occurred while opening a bank account.');
            }
        }
    }
};