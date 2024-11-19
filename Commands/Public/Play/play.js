const { EmbedBuilder,  SlashCommandBuilder,  PermissionFlagsBits } = require("discord.js");
const { checkPermissions } = require('../../../Utils/checkPermissions');

module.exports = {
    requiredBotPermissions: [PermissionFlagsBits.SendMessages, PermissionFlagsBits.Speak, PermissionFlagsBits.AttachFiles],
    data: new SlashCommandBuilder()
        .setName("play")
        .setDescription("♬˚🎧 | Play a song.")
        .addStringOption(option => option
            .setName("query")
            .setDescription("Provide the name or url for the song.")
            .setRequired(true)
        ),
    async execute(interaction, client) {
        const requiredPermissions = ['ViewChannel', 'SendMessages', 'Speak', 'AttachFiles', 'UseExternalEmojis'];
        const permissionsCheckResult = checkPermissions(interaction, requiredPermissions);

        if (permissionsCheckResult !== true) {
            return;
        }

        const { options, member, guild, channel } = interaction;

        const query = options.getString("query");
        const voiceChannel = member.voice.channel;

        const embed = new EmbedBuilder();

        if (!voiceChannel) {
            embed.setColor("#457cf0").setDescription("You must be in a voice channel to execute music commands.");
            return interaction.reply({
                embeds: [embed],
                ephemeral: true
            });
        }

        if (!member.voice.channelId == guild.members.me.voice.channelId) {
            embed.setColor("#457cf0").setDescription(`You can't use the music player as it is already active in <#${guild.members.me.voice.channelId}>`);
            return interaction.reply({
                embeds: [embed],
                ephemeral: true
            });
        }

        await interaction.deferReply({
            ephemeral: true
        });

        client.distube.play(voiceChannel, query, {
                textChannel: channel,
                member: member
            })
            .then(() => {
                interaction.editReply({
                    content: "🎶 The request has been received.",
                    ephemeral: true
                });
            })
            .catch((error) => {
                if (error && error.code === "NOT_SUPPORTED_URL") {
                    embed.setColor("#457cf0").setDescription(":x: | This is not a song link or it is not supported. Please provide the correct song name or a valid song link.");
                    interaction.editReply({
                        embeds: [embed],
                        ephemeral: true
                    });
                } else {
                    console.error(error);
                    embed.setColor("#457cf0").setDescription("⛔ | An error has occurred...");
                    interaction.editReply({
                        embeds: [embed],
                        ephemeral: true
                    });
                }
            });
    }
};