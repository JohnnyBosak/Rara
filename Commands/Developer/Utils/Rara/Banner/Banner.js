const { SlashCommandBuilder, PermissionFlagsBits, Routes, DataResolver } = require('discord.js');

module.exports = {
  subCommand: "rara.banner",
  /** 
  *
  */
    async execute(interaction, client) {
        const bannerURL = interaction.options.getString('url');
        
        try {
            await client.rest.patch(Routes.user(),{
                body: { banner: await DataResolver.resolveImage(bannerURL)}
            });
            
            interaction.reply({ content: `Banner changed successfully!`, files: [{ attachment: bannerURL }], ephemeral: true });
            
        } catch (error) {
            console.error(error);
            interaction.reply({ content: 'Failed to change banner. Please check the provided URL.', ephemeral: true });
        }
    },
};