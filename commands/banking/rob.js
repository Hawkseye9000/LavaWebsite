const { EmbedBuilder } = require('discord.js');
const Banking = require("../../mongoose/database/schemas/Banking");

module.exports = {
    name: "rob",
    description: "Attempt to rob coins from another user's bank account",
    usage: "[user]",
    permissions: {
        channel: ["VIEW_CHANNEL", "SEND_MESSAGES", "EMBED_LINKS"],
        member: [],
    },
    aliases: [],
    category: "banking",
    premium: false,
    SlashCommand: {
        options: [
            {
                name: "user",
                description: "Select user to rob",
                type: 6,
                required: true,
            },
        ],
        run: async (client, interaction) => {
            try {
                const mentionedUser = interaction.options.getUser("user");

                if (!mentionedUser) {
                    return interaction.reply('Please mention a user to rob from.');
                }

                const userBalance = await Banking.findOne({ guildId: interaction.guild.id, userId: interaction.user.id });
                const targetBalance = await Banking.findOne({ guildId: interaction.guild.id, userId: mentionedUser.id });

                if (!userBalance) {
                    return interaction.reply('You don\'t have a bank account yet.');
                }
                if (!targetBalance) {
                    return interaction.reply('The target user doesn\'t have a bank account.');
                }

                const successRate = Math.random() < 0.5;

                if (successRate) {
                    const amountStolen = Math.floor(targetBalance.balance * 0.25);
                    userBalance.balance += amountStolen;
                    targetBalance.balance -= amountStolen;

                    await userBalance.save();
                    await targetBalance.save();

                    const embed = new EmbedBuilder()
                        .setColor(0x0099FF)
                        .setDescription(`You successfully robbed ⌘ ${amountStolen} from ${mentionedUser}. Your new balance is ⌘ ${userBalance.balance}.`);

                    return interaction.reply({ embeds: [embed] });
                } else {
                    const embed = new EmbedBuilder()
                        .setColor(0xFF0000)
                        .setDescription(`You failed to rob ${mentionedUser}. Better luck next time!`);

                    return interaction.reply({ embeds: [embed] });
                }
            } catch (error) {
                console.error('Error during robbery:', error);
                return interaction.reply('An error occurred during the robbery.');
            }
        }
    }
};