const { PermissionsBitField } = require("discord.js");
const GuildConfig = require("../../mongoose/database/schemas/GuildConfig");

module.exports = {
    name: "language",
    description: "Update the bot's language for your server",
    usage: "",
    permissions: {
        channel: ["VIEW_CHANNEL", "SEND_MESSAGES", "EMBED_LINKS"],
        member: [],
    },
    aliases: [],
    category: "settings",
    premium: false,
    SlashCommand: {
        options: [
            {
                name: "language",
                description: "Select the language for the bot",
                type: 3, // String type
                required: true,
                choices: [
                    { name: "Bengali", value: "bengali" },
                    { name: "English", value: "english" },
                    { name: "Gujarati", value: "gujarati" },
                    { name: "Hindi", value: "hindi" },
                    { name: "Kannada", value: "kannada" },
                    { name: "Maithili", value: "maithili" },
                    { name: "Marathi", value: "marathi" },
                    { name: "Punjabi", value: "punjabi" },
                    { name: "Tamil", value: "tamil" },
                ],
            },
        ],
        /**
         *
         * @param {import("../structures/DiscordMusicBot")} client
         * @param {import("discord.js").Interaction} interaction
         * @param {string[]} args
         * @param {*} param3
         */
        run: async (client, interaction, args, { MusicDB }) => {
            if (!interaction.member.permissions.has(PermissionsBitField.Flags.ManageGuild))
                return interaction.reply("You don't have the 'Manage Guild' permission to run this command.")
                    .catch((err) => client.error(err));

            const language = args.value;
            const guildId = interaction.guildId;

            // Update the language setting in GuildConfig
            await GuildConfig.findOneAndUpdate({ guildId }, { language });

            return interaction.reply(`Language set to ${language}`).catch(err => { client.error(err) });
        },
    },
};