const { SlashCommandBuilder, EmbedBuilder, ButtonBuilder, ButtonStyle, ActionRowBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('avatar')
        .setDescription(`Fetch a user's avatar from the server`)
        .setDMPermission(false)
        .addUserOption(option => option
            .setName('user')
            .setDescription(`The user's avatar to fetch`)
            .setRequired(false)
        ),
    async execute(interaction) {
        try {
            const user = interaction.options.getUser('user') || interaction.user;
            const userAvatar = user.displayAvatarURL({ size: 2048, dynamic: true });

            const embed = new EmbedBuilder()
                .setColor('#eeeeee')
                .setAuthor({ name: `${user.username}'s Avatar`, iconURL: user.displayAvatarURL({ size: 64, dynamic: true }) })
                .setImage(userAvatar)
                .setFooter({ text: `Requested by ${interaction.user.username}`, iconURL: interaction.user.displayAvatarURL({ size: 64, dynamic: true }) });

            const formats = ['png', 'jpg', 'webp', 'gif'];
            const buttons = formats.map(format => new ButtonBuilder()
                .setLabel(format.toUpperCase())
                .setStyle(ButtonStyle.Link)
                .setURL(`https://cdn.discordapp.com/avatars/${user.id}/${user.avatar}.${format}?size=1024`)
            );

            const row = new ActionRowBuilder().addComponents(buttons);

            await interaction.reply({
                embeds: [embed],
                components: [row],
            });
        } catch (error) {
            console.error(error);
            await interaction.reply({ content: 'An error occurred while fetching the avatar.', ephemeral: true });
        }
    },
};