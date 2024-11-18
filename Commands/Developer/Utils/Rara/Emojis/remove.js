const { SlashCommandBuilder, PermissionFlagsBits, EmbedBuilder } = require('discord.js');
const axios = require('axios');

module.exports = {
    subCommand: "rara.emoji.remove",
    /** 
     *
     */
    async execute(interaction, client) {
        const id = interaction.options.getString('id');
        try {

            // API call to delete the emoji
            const output = await axios.delete(`https://discord.com/api/v10/applications/${client.user.id}/emojis/${id}`, {
                headers: {
                    'Authorization': `Bot ${process.env.token}`
                }
            });
            
            await interaction.reply({
                content: `Emoji with ID \`${id}\` has been successfully removed.`,
                ephemeral: true
            });

        } catch (error) {
            console.error(error);
            await interaction.reply({
                content: 'Failed to remove the emoji. Please make sure the ID is correct and try again later.',
                ephemeral: true
            });
        }
    },
};