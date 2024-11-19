const { ChatInputCommandInteraction, PermissionFlagsBits, EmbedBuilder, ChannelType } = require("discord.js");

module.exports = {
    subCommand: "guild.info",
    /** 
     *
     * @param  {ChatInputCommandInteraction} interaction
     */
    async execute(interaction) {
        try {
                  
            const memberCount = interaction.guild.memberCount;
            const botCount = interaction.guild.members.cache.filter(member => member.user.bot).size;
            const humanCount = memberCount - botCount;
            
            const channelCount = (await interaction.guild.channels.fetch()).size;
            const vcCount = (await interaction.guild.channels.fetch()).filter((channel) => channel.type === ChannelType.GuildVoice).size;
            const channeTextlCount = (await interaction.guild.channels.fetch()).filter((channel) => channel.type === ChannelType.GuildText).size;

            const embed = new EmbedBuilder()
            .setAuthor({ name: `${interaction.guild.name}`, url: interaction.guild.iconURL({ format: 'png', dynamic: true, size: 128 }) })
            .addFields(
                { name: ":id: Server ID:", value: `${interaction.guild.id}`, inline: true },
                { name: ":calendar: Created On", value: `**<t:${Math.floor(interaction.guild.createdTimestamp / 1000)}:R>**`, inline: true },
                { name: ":crown: Owned by", value: `<@!${interaction.guild.ownerId}>`, inline: true },
                { name: `:busts_in_silhouette:  Members (${memberCount})`, value: `Humans: **${humanCount}** | Bots: ${botCount}`, inline: true },
                { name: `:speech_balloon: Channels (${channelCount})`, value: `**${channeTextlCount}** Text | **${vcCount}** Voice`, inline: true },
                { name: ":earth_africa: Others", value: `**Verification Level:** ${interaction.guild.verificationLevel}`, inline: true },
                { name: `:closed_lock_with_key:  Roles (${interaction.guild.roles.cache.size})`, value: "To see a list with all roles use **/roles**", inline: true }
            )
            .setThumbnail(interaction.guild.iconURL({ format: 'png', dynamic: true, size: 128 }))
            .setImage(`https://cdn.discordapp.com/splashes/${interaction.guild.id}/${interaction.guild.splash}.png?size=2048`);            
            interaction.reply({
                embeds: [embed]
            });
        } catch (error) {
            console.error(error);
            await interaction.reply({
                content: "An error occurred while processing the command.",
                ephemeral: true
            });
        }
    },
};