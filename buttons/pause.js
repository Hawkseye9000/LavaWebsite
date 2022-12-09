const { ActionRowBuilder, ButtonBuilder, ButtonStyle } = require("discord.js");

module.exports = {
  name: 'pause',
  run: async (client, interaction, parms) => {
    const player = await client.manager.get(interaction.guildId);
    const guild = client.guilds.cache.get(interaction.guildId);
    const member = guild.members.cache.get(interaction.member.user.id);
    if (!player) return interaction.reply({ content: `❌ | **Nothing is playing right now...**` }).catch(err => { client.error(err) });
    if (!member.voice.channel) return interaction.reply({ content: `❌ | **You must be in a voice channel to use this Button!**` }).catch(err => { client.error(err) });
    if (guild.members.me.voice.channel && !guild.members.me.voice.channel.equals(member.voice.channel)) return interaction.reply({ content: `❌ | **You must be in the same voice channel as me to use this Button!**` }).catch(err => { client.error(err) });
    if (player.paused) return interaction.reply({ content: `❌ | **Music is already paused!**` }).catch(err => { client.error(err) });
    player.pause(true);

    const row = new ActionRowBuilder().addComponents([
      new ButtonBuilder()
        .setCustomId('play')
        .setLabel('▶️ Play')
        .setStyle(ButtonStyle.Success),
      new ButtonBuilder()
        .setCustomId('skip')
        .setLabel('⏭️ Skip')
        .setStyle(ButtonStyle.Secondary),
      new ButtonBuilder()
        .setCustomId('clear')
        .setLabel('🗑️ Clear')
        .setStyle(ButtonStyle.Secondary),
      new ButtonBuilder()
        .setCustomId('stop')
        .setLabel('⏹️ Stop')
        .setStyle(ButtonStyle.Secondary),
      new ButtonBuilder()
        .setCustomId('fix')
        .setLabel('⚒️ Repair')
        .setStyle(ButtonStyle.Secondary),
    ]);

    client.musicMessage[interaction.guildId].edit({ components: [row] });
    return interaction.reply({ content: `✅ | Music Paused` }).catch(err => { client.error(err) });
  }
}
