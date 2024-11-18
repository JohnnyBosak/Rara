const { SlashCommandBuilder, PermissionFlagsBits, EmbedBuilder } = require('discord.js');
const axios = require('axios');

module.exports = {
    subCommand: "rara.emoji.create",
    /** 
     *
     */
    async execute(interaction, client) {
        const emojiAttachment = interaction.options.getAttachment('emoji');
        const emojiName = interaction.options.getString('name');

        try {
            const response = await axios.get(emojiAttachment.url, {
                responseType: 'arraybuffer'
            });
            const buffer = Buffer.from(response.data, 'binary');
            const base64Image = buffer.toString('base64');

            // API call to create the emoji
            const output = await axios.post(`https://discord.com/api/v10/applications/${client.user.id}/emojis`, {
                name: emojiName,
                image: `data:image/jpeg;base64,${base64Image}`
            }, {
                headers: {
                    'Authorization': `Bot ${process.env.token}`,
                    'Content-Type': 'application/json'
                }
            });

                const emojiTag = `<${output.data.animated ? 'a' : ''}:${output.data.name}:${output.data.id}>`;
                const replyContent = `I have created a brand new emoji: ${emojiTag}\rUse \`${emojiTag}\` to include it in my messages!`;

                await interaction.reply({
                    content: replyContent,
                    ephemeral: true
                });

        } catch (error) {
            console.error(error);
            await interaction.reply({
                content: 'Failed to create the emoji. Please check the provided image and try again.',
                ephemeral: true
            });
        }
    },
};