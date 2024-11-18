const { SlashCommandBuilder, PermissionFlagsBits, EmbedBuilder } = require('discord.js');
const axios = require('axios');

module.exports = {
    subCommand: "rara.emoji.get",
    /** 
     *
     */
    async execute(interaction, client) {
        try {

            const response = await axios.get(`https://discord.com/api/v10/applications/${client.user.id}/emojis`, {
                headers: {
                    'Authorization': `Bot ${process.env.token}`
                }
            });
            
            var items = response.data.items;
            let emojiList = ``;
            
            for (const emoji of items) {
                emojiList += `- <${emoji.animated ? 'a' : ''}:${emoji.name}:${emoji.id}>, Name: \`${emoji.name}\`, ID: \`${emoji.id}\`\n`;
            }
            
            if (emojiList.length === 0) {
                emojiList = '`No emojis found.`';
            }
            
            await interaction.reply({
                content: `## Here is my app emojis list:\n\n${emojiList}`,
                ephemeral: true
            });

        } catch (error) {
            console.error(error);
            await interaction.reply({
                content: 'Failed to retrieve emojis. Please try again later.',
                ephemeral: true
            });
        }
    },
};