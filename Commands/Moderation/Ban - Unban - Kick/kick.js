const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('kick')
        .setDescription('Kick a member')
        .setDefaultMemberPermissions(PermissionFlagsBits.KickMembers)
        .setDMPermission(false)
        .addUserOption(option =>
            option.setName('user')
                .setDescription('The member to kick')
                .setRequired(true)
        )
        .addStringOption(option =>
            option.setName('reason')
                .setDescription('Reason for kicking the member')
                .setRequired(false)
        ),

    async execute(interaction, client) {
        const { options } = interaction;

        // Check if the user has the necessary permissions to kick members
        if (!interaction.member.permissions.has(PermissionFlagsBits.KickMembers)) {
            const errEmbed = {
                title: 'Insufficient Permissions',
                color: 16711680,
                description: 'You do not have the permission to kick members.',
                timestamp: new Date(),
            };
            return await interaction.reply({
                embeds: [errEmbed],
                ephemeral: true,
            });
        }

        // Get the user to be kicked and the reason (if provided)
        const userToKick = options.getUser('user');
        const reason = `Banned by ${interaction.user.tag} | ` + options.getString('reason') || 'No reason specified';

        // Check if the bot has the necessary permissions to kick members
        if (!interaction.guild.me.permissions.has(PermissionFlagsBits.KickMembers)) {
            const errEmbed = {
                title: 'Bot Permissions Error',
                color: 16711680,
                description: 'I do not have the permission to kick members. Please check my permissions.',
                timestamp: new Date(),
            };
            return await interaction.reply({
                embeds: [errEmbed],
                ephemeral: true,
            });
        }

        try {
            // Kick the user
            await interaction.guild.members.kick(userToKick, { reason });

            // Notify about the kick
            const embed = {
                title: 'Member Kicked',
                color: 16776960,
                description: `**User:** ${userToKick.tag}\n**Reason:** ${reason}`,
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
                description: 'An error occurred while trying to kick the member.',
                timestamp: new Date(),
            };
            await interaction.reply({
                embeds: [errEmbed],
                ephemeral: true,
            });
        }
    },
};
