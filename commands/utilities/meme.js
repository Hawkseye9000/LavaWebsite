const random = require("something-random-on-discord").Random;
const { EmbedBuilder } = require('discord.js');

module.exports = {
  name: "meme",
  description: "Get the good Meme",
  usage: "",
  permissions: {
    channel: ["VIEW_CHANNEL", "SEND_MESSAGES", "EMBED_LINKS"],
    member: [],
  },
  aliases: ["memes"],
  category: "utilities",
  SlashCommand: {
    /**
 *
 * @param {import("../library/DiscordModerationBot")} client
 * @param {import("discord.js").Message} message
 * @param {string[]} args
 * @param {*} param3
 */
    run: async (client, interaction) => {
      let data = await random.getMeme();
      data = data.embed;
      let meme = new EmbedBuilder(data);

      return interaction.reply({ embeds: [meme] }).catch((err) => client.error(err));
    },
  },
};