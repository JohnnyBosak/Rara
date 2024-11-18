const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');

module.exports = {
  subCommand: "rara.avatar",
  /** 
  *
  */
    async execute(interaction, client) {
        const avatarURL = interaction.options.getString('url');
        
        try {
            await client.user.setAvatar(avatarURL);
            
            interaction.reply({content: `Avatar changed successfully!`, files: [{ attachment: avatarURL }], ephemeral: true});
            
        } catch (error) {
            console.error(error);
            interaction.reply({ content: 'Failed to change avatar. Please check the provided URL.', ephemeral: true });
        }
    },
};