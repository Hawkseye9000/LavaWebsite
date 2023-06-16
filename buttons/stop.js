const { ActionRowBuilder, ButtonBuilder, ButtonStyle, PermissionsBitField } = require("discord.js");

module.exports = {
  name: 'stop',
  run: async (client, interaction, parms, { MusicDB }) => {
    const language = require(`../language/${MusicDB.language}.js`);
    let player = await client.manager.get(interaction.guildId);
    if (!interaction.member.voice.channel) return interaction.reply({ content: "❌ | **You must be in a voice channel to use this command.**" }).catch(err => { client.error(err) });
    if (!interaction.member.permissions.has(PermissionsBitField.Flags.MoveMembers)) return interaction.reply({ content: `You dont have permission to do that` }).catch(err => { client.error(err) });
    if (!player) return interaction.reply({ content: `Nothing is playing right now` }).catch(err => { client.error(err) });
    if (!client.twentyFourSeven[player.guild])
      player.destroy();
    else {
      player.queue.clear();
      player.stop();
    }

    const row = new ActionRowBuilder().addComponents([
      new ButtonBuilder()
        .setCustomId('pause')
        .setLabel(`⏸️ ${language.pauseButton}`)
        .setStyle(ButtonStyle.Primary),
      new ButtonBuilder()
        .setCustomId('skip')
        .setLabel(`⏭️ ${language.skipButton}`)
        .setStyle(ButtonStyle.Secondary),
      new ButtonBuilder()
        .setCustomId('clear')
        .setLabel(`🗑️ ${language.clearButton}`)
        .setStyle(ButtonStyle.Secondary),
      new ButtonBuilder()
        .setCustomId('stop')
        .setLabel(`⏹️ ${language.stopButton}`)
        .setStyle(ButtonStyle.Secondary),
      new ButtonBuilder()
        .setCustomId('fix')
        .setLabel(`⚒️ ${language.repairButton}`)
        .setStyle(ButtonStyle.Secondary),
    ]);

    const embed = {
      title: `${language.songTitle}`,
      description: `${language.songDesc}(https://discord.com/oauth2/authorize?client_id=946749028312416327&permissions=277083450689&scope=bot%20applications.commands)`,
      color: 0xd43790,
      image: {
        url: 'https://i.pinimg.com/originals/55/28/82/552882e7f9e8ca8ae79a9cab1f6480d6.gif',
      },
      thumbnail: {
        url: '',
      },
      footer: {
        text: `${client.user.username} Music`,
        iconURL: `${client.user.avatarURL()}`,
      },
    };
    client.musicMessage[interaction.guildId] = await interaction.channel.messages.fetch(MusicDB.musicMessageId);
    client.musicMessage[interaction.guildId].edit({ content: `${language.title}\n${language.description}`, embeds: [embed], components: [row] });
    return interaction.reply({ content: `Music Stoped` }).catch(err => { client.error(err) });
  }
}
