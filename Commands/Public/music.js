const { ChatInputCommandInteraction, SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const { joinVoiceChannel, createAudioPlayer, createAudioResource, VoiceConnectionStatus } = require('@discordjs/voice');
const ytdl = require('ytdl-core');
const ytSearch = require('yt-search');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('play')
    .setDescription('Play some music')
    .setDMPermission(false)
    .addStringOption((option) =>
      option.setName('music-title')
        .setDescription('Music you want to play')
        .setRequired(true)),
  /** 
  *
  * @param {ChatInputCommandInteraction} interaction
  */
  async execute(interaction) {
    const musicTitle = interaction.options.getString('music-title');

    await interaction.reply({ content: 'Fetching..' });

    try {
      if (!interaction.member.voice.channel) {
        await interaction.editReply({
          content: 'You must be in a voice channel to use this command.',
          ephemeral: true
        });
        return;
      }

      // Search for the YouTube video based on the music title
      const searchResults = await ytSearch(musicTitle);
      if (searchResults.videos.length === 0) {
        await interaction.editReply({
          content: 'No search results found for the provided music title.',
          ephemeral: true
        });
        return;
      }

      // Take the first video from the search results
      const firstVideo = searchResults.videos[0];
      const videoInfo = await ytdl.getBasicInfo(firstVideo.videoId);

      // Calculate the duration (replace this with the actual duration)
      const durationInSeconds = videoInfo.videoDetails.lengthSeconds;
      const formattedDuration = formatDuration(durationInSeconds);

      const embedMessage = new EmbedBuilder()
        .setColor('Green')
        .setImage(firstVideo.thumbnail)
        .setTitle('Playing Music')
        .setDescription(`:arrow_forward: **Playing [${musicTitle}](${firstVideo.url})**  - \`${formattedDuration}\`,\n*Requested by* - ${interaction.member}`)
        .setAuthor({ name: `Grom - Now Playing`, iconURL: interaction.guild.iconURL() })
        .setFooter({ text: `Volume: 100`, iconURL: interaction.client.user.displayAvatarURL() })
        .setTimestamp();

      await interaction.editReply({
        content: null,
        embeds: [embedMessage]
      });

      const connection = joinVoiceChannel({
        channelId: interaction.member.voice.channel.id,
        guildId: interaction.guild.id,
        adapterCreator: interaction.guild.voiceAdapterCreator
      });

      const audioPlayer = createAudioPlayer();
      connection.subscribe(audioPlayer);

      // Use ytdl-core to get the audio stream
      const stream = ytdl(firstVideo.url, { filter: 'audioonly' });
      const audioResource = createAudioResource(stream);
      audioPlayer.play(audioResource);


    } catch (error) {
      console.error(error);
    }
  }
};

function formatDuration(seconds) {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;
  const formattedMinutes = String(minutes).padStart(2, '0');
  const formattedSeconds = String(remainingSeconds).padStart(2, '0');
  return `[${formattedMinutes}:${formattedSeconds}]`;
}
