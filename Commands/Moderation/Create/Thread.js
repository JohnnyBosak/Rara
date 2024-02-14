const { SlashCommandBuilder, PermissionFlagsBits, ChannelType } = require('discord.js');

module.exports = {
    developer: true,
    data: new SlashCommandBuilder()
        .setName('create-thread')
        .setDescription('Create a thread')
        .setDefaultMemberPermissions(PermissionFlagsBits.CreatePublicThreads, PermissionFlagsBits.CreatePrivateThreads, PermissionFlagsBits.SendMessagesInThreads)
        .setDMPermission(false)
        .addStringOption(option =>
            option
                .setName('name')
                .setDescription('Name of the thread')
                .setRequired(true)
        )
        .addStringOption(option =>
            option
                .setName('message-id')
                .setDescription('Create a thread from a message (public thread only)')
                .setRequired(false)
        )
        .addStringOption(option =>
            option
                 .setName("archive_duration")
                 .setDescription("The thread will stop showing in the channel list after a set duration of inactivity")
                 .setRequired(false)
                 .addChoices(
                     { name: '1 hour', value: '60' },
                     { name: '24 hours', value: '1440' },
                     { name: '3 days', value: '4320' },
                     { name: '1 week', value: '10080' },
              )
        )
        .addStringOption(option =>
            option
                 .setName("type")
                 .setDescription("Type of the thread")
                 .setRequired(false)
                 .addChoices(
                     { name: 'Public Thread', value: 'PublicThread' },
                     { name: 'Private Thread', value: 'PrivateThread' },
              )
        )
        .addBooleanOption(option =>
            option
                 .setName("invitable")
                 .setDescription("Whether non-moderators can add other non-moderators to a thread (private thread only)")
                 .setRequired(false)
        )
        .addStringOption(option =>
            option
                .setName('reason')
                .setDescription('Reason for creating the thread')
                .setRequired(false)
        ),

    async execute(interaction, client) {
        const { options } = interaction;
        
        const member = interaction.member;
        const name = options.getString('name');
        const type = options.getString('type') === 'PrivateThread' ? ChannelType.GuildPrivateThread : ChannelType.GuildPublicThread;
        const message_id = options.getString('message-id') || null;
        const autoArchiveDuration = options.getString('archive_duration') || 1440;
        const invitable = options.getBoolean('invitable') ?? true;
        const reason = options.getString('reason') || null;

        const requiredPermission = type === 'PrivateThread' ? PermissionFlagsBits.CreatePrivateThreads : PermissionFlagsBits.CreatePublicThreads;
        if (!member.permissions.has(requiredPermission)) {
            const errEmbed = {
                title: 'ERROR',
                color: 16711680,
                description: `Missing Permissions: Create ${type === 'PrivateThread' ? 'Private' : 'Public'} Threads`,
                timestamp: new Date(),
            };
            return await interaction.reply({
                embeds: [errEmbed],
                ephemeral: true,
            });
        }

        let startMessage;
        if (message_id) {
            startMessage = await interaction.channel.messages.fetch(message_id);
            
            if (!startMessage) {
                const errEmbed = {
                    title: 'ERROR',
                    color: 16711680,
                    description: 'No message found in the channel',
                    timestamp: new Date(),
                    };
                return await interaction.reply({
                    embeds: [errEmbed],
                    ephemeral: true,
                    });
                }
            }
        
        // Create the thread
        const thread = await interaction.channel.threads.create({
            name,
            autoArchiveDuration,
            type,
            invitable,
            startMessage,
            reason: reason,
        }).catch(err => {
            console.error(err);
            return null;
        });

        // If the thread creation was successful
        if (thread) {
            // Notify the user
            const embed2 = {
                title: 'Created Thread Successfully!',
                fields: [
                    { name: 'Thread:', value: `<#${thread.id}>`, inline: true },
                    { name: 'Member:', value: `<@${member.id}>`, inline: true },
                    { name: 'Type:', value: `${type === 'PrivateThread' ? 'Private' : 'Public'}`, inline: true },
                    { name: 'Archive Duration:', value: `${thread.autoArchiveDuration} minutes`, inline: true },
                    { name: 'Invitable:', value: invitable === false ? 'No' : 'Yes', inline: true },
                    { name: 'Reason:', value: reason || 'Not specified', inline: false },
                ],
                timestamp: new Date(),
                color: 65280,
            };

            // Send a message to the created thread
            const threadSend = client.channels.cache.get(thread.id);
            if (threadSend) {
                //await threadSend.members.add('302050872383242240');
                const embed3 = {
                    title: 'Your Thread has been created!',
                    color: 65280,
                    description: `This is your ${type === 'PublicThread' ? null : 'Private'} Thread!`,
                    timestamp: new Date(),
                };

                // Mention the user in the thread
                threadSend.send({
                    content: `<@${interaction.user.id}>`,
                    embeds: [embed3],
                }).catch(console.error);
            }

            // Reply to the interaction in the original channel
            await interaction.reply({
                embeds: [embed2],
                ephemeral: true,
            }).catch(console.error);
        }
    },
};
