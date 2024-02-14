const { SlashCommandBuilder, PermissionFlagsBits, ChannelType } = require('discord.js');

module.exports = {
    developer: true,
    data: new SlashCommandBuilder()
        .setName('add-to-thread')
        .setDescription('Add members to an existing thread')
        .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
        .setDMPermission(false)
        .addStringOption(option =>
            option
                .setName('thread_id')
                .setDescription('ID of the thread to add members to')
                .setRequired(true)
        )
        .addUserOption(option =>
            option
                .setName('members')
                .setDescription('Members to add to the thread')
                .setRequired(true)
        ),

    async execute(interaction, client) {
        const threadId = interaction.options.getString('thread_id');//
        const members = interaction.options.getUser('members');

        // Fetch the thread
        const thread = await client.channels.fetch(threadId);
        //const thread = await client.channels.fetch(interaction.channel.id);

        // Check if the thread is valid
        if (!thread || thread.type !== ChannelType.GuildPublicThread && thread.type !== ChannelType.GuildPrivateThread) {
            return interaction.reply('Invalid thread ID or type.');
        }

        // Add members to the thread
        await thread.members.add(members);

        // Notify the user
        interaction.reply({content: `Added ${members} to the thread.`, ephemeral: true});
    },
};
