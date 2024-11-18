const { ButtonBuilder, ActionRowBuilder, SlashCommandBuilder, ButtonStyle, EmbedBuilder, PermissionsBitField } = require("discord.js");

const { Classic } = require("musicard");

const fs = require("fs");
const disClient = require("../../index.js");

const status = (queue) =>
  `Volume: \`${queue.volume}%\` | Filter: \`${queue.filters.names.join(", ") || "Off"}\` | Loop: \`${queue.repeatMode ? (queue.repeatMode === 2 ? "All Queue" : "This Song") : "Off"}\` | Autoplay: \`${queue.autoplay ? "On" : "Off"}\``;

    // Create the button components
    const pauseButton = new ButtonBuilder()
      .setCustomId("pause")
      .setLabel("⏸ Pause")
      // .setEmoji(`<:animated_icon:1253014258942214205>`)
      .setStyle(ButtonStyle.Secondary)

    const resumeButton = new ButtonBuilder()
      .setCustomId("resume")
      .setLabel("▶️ Resume")
      // .setEmoji(`<:next:1253015065838227566>`)
      .setStyle(ButtonStyle.Secondary)

    const skipButton = new ButtonBuilder()
      .setCustomId("skip")
      .setLabel("⏭️ Skip")
      // .setEmoji(`<:Z4pdepbvlK:1250143452784496702>`)
      .setStyle(ButtonStyle.Primary)

    const stopButton = new ButtonBuilder()
      .setCustomId("stop")
      .setLabel("⏹️ Stop")
      // .setEmoji(`<:e6KwaQng0t:1250144362936008816>`)
      .setStyle(ButtonStyle.Danger)

    const volumeUpButton = new ButtonBuilder()
      .setCustomId("volumeUp")
      .setLabel("🔊 Volume Up")
      // .setEmoji(`<:volume_up49:1250096177467359262>`)
      .setStyle(ButtonStyle.Success)

    const volumeDownButton = new ButtonBuilder()
      .setCustomId("volumeDown")
      .setLabel("🔉 Volume Down")
      // .setEmoji(`<:dG4lt2Dtwj:1250097057767624804>`)
      .setStyle(ButtonStyle.Danger)

    const repeat = new ButtonBuilder()
      .setCustomId("repeat")
      .setLabel("🔁 Repeat")
      //.setEmoji(`<:UK8zaNG86f:1250122827596697620>`)
      .setStyle(ButtonStyle.Danger)

    const shuffle = new ButtonBuilder()
      .setCustomId("shuffle")
      .setLabel("🔀 Shuffle")
      // .setEmoji(`<:shuffle:1250145961519611914>`)
      .setStyle(ButtonStyle.Danger)
    
    // Add filter button to action row
    const filterButton = new ButtonBuilder()
    .setCustomId("filter")
    .setLabel("Select Sound Filter")
    .setStyle(ButtonStyle.Secondary)

async function updateMusicCard(queue) {
  if (!queue || !queue.songs.length) return;

  const song = queue.songs[0];
  const elapsedTime = Math.floor(queue.currentTime);
  const duration = song.duration;
  const progressPercentage = (elapsedTime / duration) * 100;

  const minutesElapsed = Math.floor(elapsedTime / 60);
  const secondsElapsed = (elapsedTime % 60).toString().padStart(2, '0');
  const startTime = `${minutesElapsed}:${secondsElapsed}`;
  const setDisabled = queue.currentMessage && (queue.songs.length === 0 || queue.songs.length === 1);

  const musicard = await Classic({
    thumbnailImage: `${song.thumbnail}`,
    backgroundColor: "#070707",
    theme: "classic",
    progress: progressPercentage,
    progressColor: "#FF7A00",
    progressBarColor: "#5F2D00",
    name: `${song.name}`,
    nameColor: "#FF7A00",
    author: `by: ${song.user.username}`,
    authorColor: "#696969",
    startTime: startTime,
    endTime: `${song.formattedDuration}`,
    timeColor: "#FF7A00",
  });

  fs.writeFileSync("musicard.png", musicard);

  const buttons = [pauseButton, resumeButton, skipButton, stopButton, volumeUpButton, volumeDownButton, repeat, shuffle, filterButton];
  buttons.forEach(button => button.setDisabled(setDisabled));
  
  const row1 = new ActionRowBuilder()
     .addComponents(pauseButton, resumeButton, skipButton, stopButton, filterButton);

  const row2 = new ActionRowBuilder()
    .addComponents(volumeUpButton, volumeDownButton, shuffle, repeat);

  if (queue.currentMessage) {
    queue.currentMessage.edit({
        components: [row1, row2],
        files: [`musicard.png`]
    }).catch(console.error);
  }
}

async function sendMusicCard(queue, song) {
  try {
    // Create a music card
    const musicard = await Classic({
      thumbnailImage: `${song.thumbnail}`,
      backgroundColor: "#070707",
      theme: "classic",
      progress: 10,
      progressColor: "#FF7A00",
      progressBarColor: "#5F2D00",
      name: `${song.name}`,
      nameColor: "#FF7A00",
      author: `by: ${song.user.username}`,
      authorColor: "#696969",
      startTime: `0:00`, // startTime: "0:00",
      endTime: `${song.formattedDuration}`,
      timeColor: "#FF7A00"
    });
    fs.writeFileSync("musicard.png", musicard);

    const row1 = new ActionRowBuilder()
      .addComponents(pauseButton, resumeButton, skipButton, stopButton, filterButton);

    const row2 = new ActionRowBuilder()
      .addComponents(volumeUpButton, volumeDownButton, shuffle, repeat);

    queue.textChannel.send({
      components: [row1, row2],
      files: [`musicard.png`],
    }).then((message) => {
      queue.currentMessage = message;
    });

    queue.updateInterval = setInterval(() => {
      updateMusicCard(queue);
    }, 5000);

  } catch (error) {
    console.error("Error sending music card:", error);
  }
}

disClient.distube
  .on('playSong', async (queue, song) => {
    try {
      if (queue.currentMessage) {
        queue.currentMessage.delete().catch(console.error);
        queue.currentMessage = undefined;
      }

      await sendMusicCard(queue, song);
    } catch (error) {
      console.error("Error playing the song:", error);
    }
  })
  .on('addSong', (queue, song) => {
    try {
      queue.textChannel.send(`🎶 Added ${song.name} - \`${song.formattedDuration}\` to the queue by ${song.user}`);
    } catch (error) {
      console.error("Error adding song:", error);
    }
  })
  .on('addList', (queue, playlist) => {
    try {
      queue.textChannel.send(`🎶 Added \`${playlist.name}\` playlist (${playlist.songs.length} songs) to the queue\n${(queue)}`);
    } catch (error) {
      console.error("Error when adding the playlist:", error);
    }
  })
  .on('error', (channel, e) => {
    console.error(e);
  })
  .on('empty', (queue) => {
    try {
      const channel = queue.textChannel;
      if (channel && typeof channel.send === 'function') {
        channel.send('⛔ Voice channel is empty! Leaving the channel...');
      } else {
        console.error("Error handling empty channel: Invalid channel or no send() method");
      }
    } catch (error) {
      console.error("Error handling empty channel:", error);
    }
  })
  .on('searchNoResult', (message, query) => {
    try {
      message.channel.send(`⛔ No results found for \`${query}\`!`);
    } catch (error) {
      console.error("Error handling search with no results:", error);
    }
  })
  disClient.distube
  .on('finish', async (queue) => {
    try {
        await updateMusicCard(queue);
    } catch (error) {
      console.error("Error handling end event:", error);
    }
      if (queue.connection) { queue.connection.disconnect(); }
  });


module.exports = {
  name: "interactionCreate",

  async execute(interaction, client) {
    
    try {
      if (!interaction.isButton()) return;

        const queue = client.distube.getQueue(interaction.guildId);
        if (!queue) return;

    const volumeFilter = (i) => ["volumeUp", "volumeDown", "pause", "resume"].includes(i.customId) && i.user.id === interaction.user.id;
    if (volumeFilter(interaction)) {
      if (interaction.customId === "volumeUp") {
        if (queue.volume >= 100) {
          await interaction.update({ content: "🔊 Volume is at maximum level (100%)" });
        } else {
          const newVolume = Math.min(queue.volume + 10, 100);
          client.distube.setVolume(interaction.guild, newVolume);
          await interaction.update({ content: `🔊 Volume increased to ${newVolume}%` });
        }
      } else if (interaction.customId === "volumeDown") {
        if (queue.volume <= 0) {
          await interaction.update({ content: "🔉 Volume is at minimum level (0%)" });
        } else {
          const newVolume = Math.max(queue.volume - 10, 0);
          client.distube.setVolume(interaction.guild, newVolume);
          await interaction.update({ content: `🔉 Volume decreased to ${newVolume}%` });
        }
      } else if (interaction.customId === "pause") {
        if (queue.paused) {
          await interaction.update({ content: "⏸ Music was already paused.", ephemeral: true });
        } else {
          client.distube.pause(interaction.guild);
          await interaction.update({ content: "⏸ Music has been paused." });
        }
      } else if (interaction.customId === "resume") {
        if (!queue.paused) {
          await interaction.update({ content: "▶️ Music is not paused.", ephemeral: true });
        } else {
          client.distube.resume(interaction.guild);
          await interaction.update({ content: "▶️ Resuming the song." });
        }
      }
      return;
    }

        const authorizedId = ['User ID 1', 'User ID 2'];
        if (!authorizedId.includes(interaction.user.id)) {
          const embed = new EmbedBuilder()
            .setColor(`Red`)
            .setTitle(`NOTE!`)
            .setDescription(`You can contact [@Valheim Survival](https://discord.com/channels/@me/1225249585656496149) for assistance\n\`\`\`yml\nOnly administrators can use the music control buttons.\`\`\``)
            .setTimestamp()
            .setFooter({ text: `Bot-Youtube` });
        
          await interaction.reply({ embeds: [embed], ephemeral: true });
          return;
        }

const filterOptions = ["earwax", "tremolo", "surround", "karaoke"];
const filterOptions1 = ["vaporwave", "mcompand", "echo", "3d"];

    if (interaction.customId === "filter") {
      const filterOptionsRow = filterOptions.map(option => 
        new ButtonBuilder()
          .setCustomId(option)
          .setLabel(option)
          .setStyle(ButtonStyle.Primary)
      );

      const filterOptionsRow1 = filterOptions1.map(option => 
        new ButtonBuilder()
          .setCustomId(option)
          .setLabel(option)
          .setStyle(ButtonStyle.Primary)
      );

      const actionRow = new ActionRowBuilder().addComponents(...filterOptionsRow);
      const actionRow1 = new ActionRowBuilder().addComponents(...filterOptionsRow1);

      await interaction.reply({ content: "Please choose a filter:", ephemeral: true, components: [actionRow, actionRow1] });
    }

if (filterOptions.includes(interaction.customId) || filterOptions1.includes(interaction.customId)) {
  const selectedFilter = interaction.customId;
  const defaultFilters = {
    "3d": "apulsator=hz=0.125",
    bassboost: "bass=g=10",
    echo: "aecho=0.8:0.9:1000:0.3",
    flanger: "flanger",
    gate: "agate",
    haas: "haas",
    karaoke: "stereotools=mlev=0.1",
    nightcore: "asetrate=48000*1.25,aresample=48000,bass=g=5",
    reverse: "areverse",
    vaporwave: "asetrate=48000*0.8,aresample=48000,atempo=1.1",
    mcompand: "mcompand",
    phaser: "aphaser",
    tremolo: "tremolo",
    surround: "surround",
    earwax: "earwax"
  };

  if (filterOptions.includes(interaction.customId) || filterOptions1.includes(interaction.customId)) {
    const selectedFilter = interaction.customId;
    if (!client.distube.getQueue(interaction)) {
      await interaction.reply({ content: "There is no song currently playing.", ephemeral: true });
      return;
    }
    client.distube.getQueue(interaction, selectedFilter);
    await interaction.reply({ content: `You have selected the filter ${selectedFilter}.`, ephemeral: true });
    return;
  }
}  
      const filter = (i) => ["skip", "stop", "shuffle", "repeat"].includes(i.customId) && i.user.id === interaction.user.id;
  
      if (filter(interaction)) {
  
        if (interaction.customId === "skip") {
          if (queue.songs.length <= 1) {
            await interaction.update({ content: "⚠️ Not enough songs in the queue to skip.", ephemeral: true });
          } else {
            client.distube.skip(interaction.guild);
            await interaction.update({ content: "⏭️ Song skipped." });
          }
        } else if (interaction.customId === "stop") {
          client.distube.stop(interaction.guild);
          await interaction.update({ content: "⏹️ Music stopped." });
        } else if (interaction.customId === "shuffle") {
          if (!queue.songs.length || queue.songs.length === 1) {
            await interaction.update({ content: "⚠️ Not enough songs in the queue to shuffle." });
          } else {
            client.distube.shuffle(interaction.guild);
            await interaction.update({ content: "🔀 Queue shuffled." });
          }
        } else if (interaction.customId === "repeat") {
          if (!queue.songs.length) {
            await interaction.update({ content: "⚠️ No songs in the queue to repeat." });
          } else {
            const repeatMode = queue.repeatMode;
            client.distube.setRepeatMode(interaction.guild, repeatMode === 0 ? 1 : 0);
            await interaction.update({ content: `🔁 Repeat mode has been set to ${repeatMode === 0 ? "on" : "off"}` });
          }
        }
      }
    } catch (error) {
      console.error("Error handling interaction:", error);
    }
  },
};