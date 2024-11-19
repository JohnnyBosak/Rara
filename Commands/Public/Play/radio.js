const { ActionRowBuilder, ButtonBuilder, ButtonStyle, StringSelectMenuBuilder, EmbedBuilder, SlashCommandBuilder, PermissionFlagsBits } = require("discord.js");
const { joinVoiceChannel, createAudioPlayer, createAudioResource, VoiceConnectionStatus, AudioPlayerStatus } = require('@discordjs/voice');

const { checkPermissions } = require('../../../Utils/checkPermissions');

const radioChannels = {
    "Capital FM (UK)": "https://media-ssl.musicradio.com/CapitalMP3",
    "Heart FM (UK)": "https://media-ssl.musicradio.com/HeartLondon",
    "Virgin Radio (UK)": "https://radio.virginradio.co.uk/stream",
    "Non Stop Pop FM (GTA V)": "https://stream-170.zeno.fm/hace1hc4vwzuv?zt=eyJhbGciOiJIUzI1NiJ9.eyJzdHJlYW0iOiJoYWNlMWhjNHZ3enV2IiwiaG9zdCI6InN0cmVhbS0xNzAuemVuby5mbSIsImp0aSI6ImFrMWZkVDd4VFRxVnlCSFpVMTZoX1EiLCJpYXQiOjE3MTQwODU3NTYsImV4cCI6MTcxNDA4NTgxNn0.fgxflZ5-_GwrXtO0VROwbdFMw3w6KxW4SN7Ugknqm1w&zttl=5",
    "Vinewood Boulevard Radio (GTA V)": "https://stream-176.zeno.fm/v477h3aa0xhvv?zt=eyJhbGciOiJIUzI1NiJ9.eyJzdHJlYW0iOiJ2NDc3aDNhYTB4aHZ2IiwiaG9zdCI6InN0cmVhbS0xNzYuemVuby5mbSIsImp0aSI6IlFRUjhqbTJTUjVTRkU3cmtOSDJLcGciLCJpYXQiOjE3MTQwODYzOTEsImV4cCI6MTcxNDA4NjQ1MX0.YUUcECc-zrWF8jI2svezfaS3pyvPE7xUcqvCaOUj5hY&zttl=5",
    "Dance FM (USA)": "https://stream-157.zeno.fm/g9m2run7a5zuv?zt=eyJhbGciOiJIUzI1NiJ9.eyJzdHJlYW0iOiJnOW0ycnVuN2E1enV2IiwiaG9zdCI6InN0cmVhbS0xNTcuemVuby5mbSIsImp0aSI6IlBHRFNLalhxU0NpWUk0azRDUHkzaEEiLCJpYXQiOjE3MTQwODc0OTAsImV4cCI6MTcxNDA4NzU1MH0.6zecvbS5_clBZiPA6sFuKDm57NOtiwy7SzM-4cM4lTE&zttl=5",
    "Los Santos Rock Radio (GTA V)": "https://stream-172.zeno.fm/tj3tqbxapzftv?zt=eyJhbGciOiJIUzI1NiJ9.eyJzdHJlYW0iOiJ0ajN0cWJ4YXB6ZnR2IiwiaG9zdCI6InN0cmVhbS0xNzIuemVuby5mbSIsImp0aSI6IkZBaVlwZkZFVHMtSUZyTGtOSHhyX1EiLCJpYXQiOjE3MTQwODczNzYsImV4cCI6MTcxNDA4NzQzNn0.vKljbL0Lcb0t_xvnsKaXQ-GlHOmUlIYjl94F9Y-pMpM&zttl=5",
    "Radio Mirror Park (GTA V)": "https://stream-153.zeno.fm/sy424e9uty8uv?zt=eyJhbGciOiJIUzI1NiJ9.eyJzdHJlYW0iOiJzeTQyNGU5dXR5OHV2IiwiaG9zdCI6InN0cmVhbS0xNTMuemVuby5mbSIsImp0aSI6IkFCMUFXMXlIUVlhZFNLcUJOZFlLZlEiLCJpYXQiOjE3MTQwODc2NzUsImV4cCI6MTcxNDA4NzczNX0.azag4xkG1u0XxTYligg4HNgkefgxRctYivESilgYqpk&zttl=5"
};

let connection;
let player;
let currentVolume = 50; // Initial volume 50%
let previousVolumes = {}; // Previous volumes for different channels

module.exports = {
    requiredBotPermissions: [PermissionFlagsBits.SendMessages, PermissionFlagsBits.Speak],
    data: new SlashCommandBuilder()
        .setName('radio')
        .setDescription('Play a radio station.'),
    async execute(interaction) {
        const { guild, member } = interaction;
        
      const requiredPermissions = ['ViewChannel', 'SendMessages', 'Speak', 'UseExternalEmojis'];
      const permissionsCheckResult = checkPermissions(interaction, requiredPermissions);

      if (permissionsCheckResult !== true) {
          return;
        } 

        const radioOptions = Object.keys(radioChannels).map(channel => ({
            label: channel.toUpperCase(),
            value: channel
        }));

        const row = new ActionRowBuilder()
            .addComponents(
                new StringSelectMenuBuilder()
                    .setCustomId('radioSelect')
                    .setPlaceholder('Select a radio channel')
                    .addOptions(radioOptions)
            );

        const embed = new EmbedBuilder()
            .setColor('#0099ff')
            .setTitle('Radios List')
            .setDescription('Select a radio channel from the drop-down list')
            .setTimestamp();

        const volumeDownButton = new ButtonBuilder()
            .setCustomId('volumeDown')
            .setEmoji('🔈')
            .setStyle(ButtonStyle.Secondary);

        const volumeUpButton = new ButtonBuilder()
            .setCustomId('volumeUp')
            .setEmoji('🔊')
            .setStyle(ButtonStyle.Secondary);

        const stopButton = new ButtonBuilder()
            .setCustomId('stop')
            .setEmoji('⏹')
            .setStyle(ButtonStyle.Secondary);

        const buttonRow = new ActionRowBuilder()
            .addComponents( volumeDownButton, volumeUpButton, stopButton);

        await interaction.reply({ embeds: [embed], components: [buttonRow, row] });

        const filter = i => i.customId === 'radioSelect' && i.user.id === interaction.user.id;
        const collector = interaction.channel.createMessageComponentCollector({ filter });

        let buttonCollector; // Hozzuk létre az új buttonCollector változót az execute függvényen kívül, hogy elérhető legyen minden rádióválasztásnál

        collector.on('collect', async i => {
            if (!i.isStringSelectMenu()) return;

            const selectedChannel = i.values[0];
            const url = radioChannels[selectedChannel];

            try {
                if (!member.voice.channel) {
                    throw new Error('You must be in a voice channel to play radio!');
                }

                connection = joinVoiceChannel({
                    channelId: member.voice.channel.id,
                    guildId: guild.id,
                    adapterCreator: guild.voiceAdapterCreator,
                    selfDeaf: false
                });

                player = createAudioPlayer();
                connection.subscribe(player);

                let volume = currentVolume / 100;
                if (previousVolumes[selectedChannel]) {
                    volume = previousVolumes[selectedChannel] / 100; // Használjuk az előzőleg beállított hangerőt, ha van ilyen
                } else {
                    previousVolumes[selectedChannel] = currentVolume; // Ha nincs előzőleg beállított hangerő, akkor állítsuk be az aktuális hangerőt
                }

                const resource = createAudioResource(url, { inlineVolume: true, volume });
                player.play(resource);

                embed.setDescription(`📻 Selected radio channel: ${selectedChannel} \n 🔉 Volume: ${currentVolume}%`);
                await i.update({ embeds: [embed], components: [buttonRow, row] });

                const buttonFilter = i => i.customId === 'volumeUp' || i.customId === 'volumeDown' || i.customId === 'stop';

                if (buttonCollector) buttonCollector.stop(); // Ha van aktív buttonCollector, állítsd le, mielőtt újat hoznál létre

                buttonCollector = interaction.channel.createMessageComponentCollector({ filter: buttonFilter, time: 60000 });

                buttonCollector.on('collect', async buttonInteraction => {
                    if (buttonInteraction.isButton()) {
                        const { customId } = buttonInteraction;
                        switch (customId) {
                            case 'volumeUp':
                                if (currentVolume < 100) {
                                    previousVolumes[selectedChannel] = currentVolume; // Előző hangerő frissítése
                                    currentVolume += 10;
                                    player.state.resource.volume?.setVolume(currentVolume / 100);
                                    embed.setDescription(`📻 Selected radio channel: ${selectedChannel} \n 🔉 Volume: ${currentVolume}%`);
                                }
                                break;
                            case 'volumeDown':
                                if (currentVolume > 0) {
                                    previousVolumes[selectedChannel] = currentVolume; // Előző hangerő frissítése
                                    currentVolume -= 10;
                                    player.state.resource.volume?.setVolume(currentVolume / 100);
                                    embed.setDescription(`📻 Selected radio channel: ${selectedChannel} \n 🔉 Volume: ${currentVolume}%`);
                                }
                                break;
                            case 'stop':
                                player.stop(connection);
                                connection.destroy();
                                break;
                        }
                        await buttonInteraction.update({ embeds: [embed], components: [buttonRow, row] });
                    }
                });

            } catch (error) {
                console.error(error);
                await interaction.editReply({ content: error.message, embeds: [], components: [] });
            }
        });

        collector.on('end', async collected => {
            if (collected.size === 0) {
                await interaction.editReply({ content: "You didn't choose a channel in time", embeds: [], components: [] });
            }
        });
    },
};