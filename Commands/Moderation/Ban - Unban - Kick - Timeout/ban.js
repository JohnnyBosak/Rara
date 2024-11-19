const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('ban')
        .setDescription('Ban a member')
        .setDefaultMemberPermissions(PermissionFlagsBits.BanMembers)
        .setDMPermission(false)
        .addUserOption(option =>
            option.setName('user')
                .setDescription('The member to ban')
                .setRequired(true)
        )
        .addStringOption(option =>
            option.setName('reason')
                .setDescription('Reason for banning the member')
                .setRequired(false)
        ),

    async execute(interaction, client) {
        const { options } = interaction;

        // Check if the user has the necessary permissions to ban members
        if (!interaction.member.permissions.has(PermissionFlagsBits.BanMembers)) {
            const errEmbed = {
                title: 'Insufficient Permissions',
                color: 16711680,
                description: 'You do not have the permission to ban members.',
                timestamp: new Date(),
            };
            return await interaction.reply({
                embeds: [errEmbed],
                ephemeral: true,
            });
        }

        // Get the user to be banned and the reason (if provided)
        const userToBan = options.getUser('user');
        const reason = `Banned by ${interaction.user.tag} | ` + options.getString('reason') || 'No reason specified';

        // Check if the bot has the necessary permissions to ban members
        if (!interaction.guild.me.permissions.has(PermissionFlagsBits.BanMembers)) {
            const errEmbed = {
                title: 'Bot Permissions Error',
                color: 16711680,
                description: 'I do not have the permission to ban members. Please check my permissions.',
                timestamp: new Date(),
            };
            return await interaction.reply({
                embeds: [errEmbed],
                ephemeral: true,
            });
        }

        try {
            // Ban the user
            await interaction.guild.members.ban(userToBan, { reason });

            // Notify about the ban
            const embed = {
                title: 'Member Banned',
                color: 16711680,
                description: `**User:** ${userToBan.tag}\n**Reason:** ${reason}`,
                timestamp: new Date(),
            };
            await interaction.reply({
                embeds: [embed],
                ephemeral: true,
            });
        } catch (error) {
            console.error(error);
            const errEmbed = {
                title: 'Error',
                color: 16711680,
                description: 'An error occurred while trying to ban the member.',
                timestamp: new Date(),
            };
            await interaction.reply({
                embeds: [errEmbed],
                ephemeral: true,
            });
        }
    },
};
