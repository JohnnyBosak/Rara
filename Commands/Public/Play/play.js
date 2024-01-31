const { EmbedBuilder, SlashCommandBuilder } = require("discord.js");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("play")
        .setDescription("Play a song.")
        .addStringOption(option => option
            .setName("query")
            .setDescription("Provide the name or url for the song.")
            .setRequired(true)
        ),
    async execute(interaction, client) {
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

        interaction.reply({
            content: "<:music:1202180879883960330> Request received",
            ephemeral: true
            });

        try {
            await client.distube.play(voiceChannel, query, {
                textChannel: channel,
                member: member
            });

        } catch (error) {
            console.log(error);

            // Check if the error is related to a private video
            if (error.name === 'PlayError' && error.message.includes('private video')) {
                embed.setColor("#457cf0").setDescription("⛔ | Sorry, I can't play private videos..");
            } else if (error.name === 'PlayError' && error.message.includes('Video unavailable')) {
                embed.setColor("#457cf0").setDescription("⛔ | Sorry, the requested video is unavailable. It may have been removed or restricted..");
            } else {
                embed.setColor("#457cf0").setDescription("⛔ | Something went wrong...");
            }

            return interaction.followUp({
                    embeds: [embed],
                    ephemeral: true
                });
         }
    }
};
