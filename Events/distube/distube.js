const { ButtonBuilder, ActionRowBuilder, SlashCommandBuilder, ButtonStyle } = require("discord.js");

const { musicCard } = require("musicard");

const fs = require("fs");
const disClient = require("../../index.js");

const status = (queue) =>
  `Volume: \`${queue.volume}%\` | Filter: \`${queue.filters.names.join(", ") || "Off"}\` | Loop: \`${queue.repeatMode ? (queue.repeatMode === 2 ? "All Queue" : "This Song") : "Off"}\` | Autoplay: \`${queue.autoplay ? "On" : "Off"}\``;

// Function to create and send the music card
async function sendMusicCard(progression, queue, song, setDisabled) {
  // Create a music card
  const card = new musicCard()
    .setName(song.name)
    .setAuthor(`By ${song.user.username}`)
    .setColor("auto")
    .setTheme("classic")
    .setBrightness(50)
    .setThumbnail(song.thumbnail)
    .setProgress(progression)
    .setStartTime("0:00")
    .setEndTime(song.formattedDuration);

  // Build the card and save it as musicard.png
  const cardBuffer = await card.build();
  fs.writeFileSync(`musicard.png`, cardBuffer);

  // Create the button components
  const pauseButton = new ButtonBuilder()
    .setCustomId("pause")
    .setLabel("Pause")
    .setStyle(ButtonStyle.Secondary)
    .setDisabled(setDisabled);

  const resumeButton = new ButtonBuilder()
    .setCustomId("resume")
    .setLabel("Resume")
    .setStyle(ButtonStyle.Secondary)
    .setDisabled(setDisabled);

  const skipButton = new ButtonBuilder()
    .setCustomId("skip")
    .setLabel("Skip")
    .setStyle(ButtonStyle.Danger)
    .setDisabled(setDisabled);

  // Create a new action row for the additional buttons
  const stopButton = new ButtonBuilder()
    .setCustomId("stop")
    .setLabel("Stop")
    .setStyle(ButtonStyle.Primary)
    .setDisabled(setDisabled);

  const volumeUpButton = new ButtonBuilder()
    .setCustomId("volumeUp")
    .setLabel("Volume Up")
    .setStyle(ButtonStyle.Success)
    .setDisabled(setDisabled);

  const volumeDownButton = new ButtonBuilder()
    .setCustomId("volumeDown")
    .setLabel("Volume Down")
    .setStyle(ButtonStyle.Danger)
    .setDisabled(setDisabled);

  const repeat = new ButtonBuilder()
    .setCustomId("repeat")
    .setLabel("Repeat")
    .setStyle(ButtonStyle.Danger)
    .setDisabled(setDisabled);

  const shuffle = new ButtonBuilder()
    .setCustomId("shuffle")
    .setLabel("Shuffle")
    .setStyle(ButtonStyle.Danger)
    .setDisabled(setDisabled);

  // Create action row components
  const row1 = new ActionRowBuilder()
    .addComponents(pauseButton, resumeButton, skipButton, stopButton);

  const row2 = new ActionRowBuilder()
    .addComponents(volumeUpButton, volumeDownButton, shuffle, repeat);

  return {
    components: [row1, row2],
    files: [`musicard.png`]
  };
}

disClient.distube
  .on('playSong', async (queue, song) => {
    if (queue.currentMessage) {
      queue.currentMessage.delete().catch(console.error);
      queue.currentMessage = undefined;
    }

    // Send the music card
    const messageObject = await sendMusicCard(progression = 10, queue, song, setDisabled = false);
    queue.textChannel.send({
      content: `<:music:1202180879883960330> Now Playing: **${song.name}** - Requested by: ${song.user}`,
      components: messageObject.components,
      files: messageObject.files, // Send the saved music card image as a file
    }).then((message) => {
      queue.currentMessage = message;
    });
  })
  .on('addSong', (queue, song) => {
    queue.textChannel.send({
        content: `<:music:1202180879883960330> Added **${song.name} - \`${song.formattedDuration}\`** to the queue by ${song.user}`,
        allowedMentions: { parse: [] }
    });
  })
  .on('addList', (queue, playlist) => {
    queue.textChannel.send({
        content: `<:music:1202180879883960330> Added **\`${playlist.name}\` playlist (${playlist.songs.length} songs)** to queue\n${status(queue)} by ${playlist.user}`,
    allowedMentions: { parse: [] }
    });
  })
  .on('error', (channel, e) => {
    console.error(e);
  })
  .on('empty', (channel) => {
    channel.send('⛔ Voice channel is empty! Leaving the channel...');
  })
  .on('searchNoResult', (message, query) => {
    message.channel.send(`⛔ No result found for \`${query}\`!`);
  })
  .on('finish', async (queue) => {
    if (queue.currentMessage && (queue.songs.length === 0 || queue.songs.length === 1)) {
        const messageObject = await sendMusicCard(progression = 100, queue, song = queue.songs[0], setDisabled = true);
        
        queue.currentMessage.edit({
            content: '🏁 Queue finished!',
            components: messageObject.components,
            files: messageObject.files
        }).catch(error => {
        if (error.code === 10008) {
            queue.textChannel.send({
                content: '🏁 Queue finished!',
                components: messageObject.components,
                files: messageObject.files
                });
            } else {
                console.log(error);
            }
        });
    }
    if (queue.connection) { queue.connection.disconnect(); }
  });

module.exports = {
  name: "interactionCreate",

  async execute(interaction, client) {
    if (!interaction.isButton()) return;

    const filter = (i) => ["pause", "resume", "skip", "stop", "volumeUp", "volumeDown", "shuffle", "repeat"].includes(i.customId) && i.user.id === interaction.user.id;

    if (filter(interaction)) {
      const queue = client.distube.getQueue(interaction.guildId);
      if (!queue) return;

      if (interaction.customId === "pause") {
        client.distube.pause(interaction.guild);
        await interaction.update({ content: "⏸ Music paused." });
      } else if (interaction.customId === "resume") {
        if (!queue.pause) {
          await interaction.update({ content: "▶️ Music is not paused.", ephemeral: true });
        } else {
          client.distube.resume(interaction.guild);
          await interaction.update({ content: "▶️ Music resumed." });
        }
      } else if (interaction.customId === "skip") {
        if (queue.songs.length <= 1) {
          await interaction.update({ content: "⚠️ Not enough songs in the queue to skip.", ephemeral: true });
        } else {
          client.distube.skip(interaction.guild);
          await interaction.update({ content: "⏭️ Song skipped." });
        }
      } else if (interaction.customId === "stop") {
        client.distube.stop(interaction.guild);
        await interaction.update({ content: "⏹️ Music stopped." });
      } else if (interaction.customId === "volumeUp") {
        if (queue.volume >= 100) {
          await interaction.update({ content: "🔊 Volume is already at maximum (100%)" });
        } else {
          const newVolume = Math.min(queue.volume + 10, 100);
          client.distube.setVolume(interaction.guild, newVolume);
          await interaction.update({ content: `🔊 Volume increased to ${newVolume}%` });
        }
      } else if (interaction.customId === "volumeDown") {
        if (queue.volume <= 0) {
          await interaction.update({ content: "🔉 Volume is already at minimum (0%)" });
        } else {
          const newVolume = Math.max(queue.volume - 10, 0);
          client.distube.setVolume(interaction.guild, newVolume);
          await interaction.update({ content: `🔉 Volume decreased to ${newVolume}%` });
        }
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
          await interaction.update({ content: `🔁 Repeat mode set to ${repeatMode === 0 ? "queue" : "off"}` });
        }
      }
    }
  }
};
