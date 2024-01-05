const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const { joinVoiceChannel, createAudioPlayer, createAudioResource, VoiceConnectionStatus } = require('@discordjs/voice');

const baseUrl = 'https://www.myinstants.com/media/sounds/';
const soundMap = {
  Bruh: 'movie_1_C2K5NH0.mp3',
  BTS: '/jessicakpopper.mp3',
  SummertimeNyan: 'summer-time-anime-love_q5du5Qo.mp3',
  uwu: 'sussy-uwu.mp3',
  awShit: 'gta-san-andreas-ah-shit-here-we-go-again.mp3',
  sukiSuki: '1080p-kaguya-sama-wk-03_trim1-online-audio-converter.mp3',
  Jesus: 'usadapekora_oh_no_jesus1.mp3',
  what: 'pekorawhat.mp3',
  PekoraMikoIntro: 'usada-pekora-sakura-miko-fly-me.mp3',
  DoorKnocking: 'crazy-realistic-knocking-sound-troll-twitch-streamers_small.mp3'
};

module.exports = {
  data: new SlashCommandBuilder()
    .setName('yosoundboard')
    .setDescription('Play a sound')
    .setDMPermission(false)
    .addStringOption((option) =>
      option.setName('sound')
        .setDescription('Your choice')
        .setRequired(false)
        .addChoices(
          { name: 'Bruh', value: 'Bruh' },
          { name: 'BTS', value: 'BTS' },
          { name: 'sukisuki', value: 'sukisuki' },
          { name: 'awShit', value: 'awShit' },
          { name: 'uwu', value: 'uwu' },
          { name: 'SummertimeNyan', value: 'SummertimeNyan' },
          { name: 'Pekora- Oh no Jesus!', value: 'Jesus' },
          { name: 'Pekora - What?', value: 'what' },
          { name: 'Pekora Miko Intro', value: 'PekoraMikoIntro' },
          { name: 'Door Knocking', value: 'DoorKnocking' }
        )
    )
    .addStringOption((option) =>
      option.setName('url-sound')
        .setDescription('Insert your own soundboard mp3 url')
        .setRequired(false)
    ),
  async execute(interaction) {
    let audioURL = null;
    try {
      const sound = interaction.options.getString('sound');
      const customSound = interaction.options.getString('url-sound');

      if (sound) {
        audioURL = baseUrl + soundMap[sound];
      }
      if (customSound) { audioURL = customSound }

      if (!audioURL) {
        await interaction.reply({ content: 'Invalid sound option.', ephemeral: true });
        return;
      }

      if (!interaction.member.voice.channel) {
        await interaction.reply({ content: 'You must be in a voice channel to use this command.', ephemeral: true });
        return;
      }

      const connection = joinVoiceChannel({
        channelId: interaction.member.voice.channel.id,
        guildId: interaction.guild.id,
        adapterCreator: interaction.guild.voiceAdapterCreator
      });

      const audioPlayer = createAudioPlayer();
      connection.subscribe(audioPlayer);

      const audioResource = createAudioResource(audioURL);
      audioPlayer.play(audioResource);

      const embedMessage = new EmbedBuilder()
        .setColor('Green')
        .setThumbnail('https://i.ibb.co/sydgdPL/f9811c56c6.gif')
        .setTitle('Playing Sound')
        .setDescription(`Playing sound: ${sound}`)
        .setTimestamp();

      await interaction.reply({ embeds: [embedMessage], fetchReply: true });

      audioPlayer.on('stateChange', (oldState, newState) => {
        if (newState.status === 'idle') {
          connection.destroy();

          embedMessage.setThumbnail('https://i.ibb.co/G7tgQQF/ETWgRqs.png').setDescription(`Finished playing sound: ${sound}`);

          interaction.editReply({ embeds: [embedMessage] });
        }
      });

      audioPlayer.on('error', error => {
        console.error(error);
        connection.destroy();
        embedMessage.setDescription(`Error playing sound: ${sound}`);
        interaction.reply({ embeds: [embedMessage], ephemeral: true });
      });
    } catch (error) {
      console.error(error);
      // Handle any other unexpected errors here
    }
  }
};
