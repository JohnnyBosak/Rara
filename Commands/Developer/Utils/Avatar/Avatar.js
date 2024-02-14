const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');

module.exports = {
    developer: true,
    data: new SlashCommandBuilder()
        .setName('avatar')
        .setDescription('Change Rara avatar')
        .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
        .setDMPermission(true)
        .addStringOption(option =>
            option
                .setName('url')
                .setDescription('URL of the new avatar')
                .setRequired(true)
        ),

    async execute(interaction, client) {
        const avatarURL = interaction.options.getString('url');
        
        try {
            await client.user.setAvatar(avatarURL);
            
            interaction.reply({content: `Avatar changed successfully!`, Files: [{ attachment: avatarURL }], ephemeral: true});
            
        } catch (error) {
            console.error(error);
            interaction.reply({ content: 'Failed to change avatar. Please check the provided URL.', ephemeral: true });
        }
    },
};
