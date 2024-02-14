const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('unban')
        .setDescription('Unban a member')
        .setDefaultMemberPermissions(PermissionFlagsBits.BanMembers)
        .setDMPermission(false)
        .addStringOption(option =>
            option.setName('user')
                .setDescription('The user ID to unban')
                .setRequired(true)
        )
        .addStringOption(option =>
            option.setName('reason')
                .setDescription('Reason for unbanning the member')
                .setRequired(false)
        ),

    async execute(interaction, client) {
        const { options } = interaction;

        // Check if the user has the necessary permissions to unban members
        if (!interaction.member.permissions.has(PermissionFlagsBits.BanMembers)) {
            const errEmbed = {
                title: 'Insufficient Permissions',
                color: 16711680,
                description: 'You do not have the permission to unban members.',
                timestamp: new Date(),
            };
            return await interaction.reply({
                embeds: [errEmbed],
                ephemeral: true,
            });
        }

        // Get the user ID to be unbanned and the reason (if provided)
        const userToUnbanId = options.getString('user');
        const reason = `Unbanned by ${interaction.user.tag} | ` + options.getString('reason') || 'No reason specified';

        try {
            // Fetch the list of banned users
            const banList = await interaction.guild.bans.fetch();

            // Check if the user is in the ban list
            const bannedUser = banList.get(userToUnbanId);

            if (bannedUser) {
                // Unban the user
                await interaction.guild.bans.remove(userToUnbanId, reason);

                // Notify about the unban
                const embed = {
                    title: 'Member Unbanned',
                    color: 65280,
                    description: `**User ID:** ${userToUnbanId}\n**Reason:** ${reason}`,
                    timestamp: new Date(),
                };
                await interaction.reply({
                    embeds: [embed],
                    ephemeral: true,
                });
            } else {
                const errEmbed = {
                    title: 'User Not Banned',
                    color: 16711680,
                    description: 'The specified user is not currently banned.',
                    timestamp: new Date(),
                };
                await interaction.reply({
                    embeds: [errEmbed],
                    ephemeral: true,
                });
            }
        } catch (error) {
            console.error(error);
            const errEmbed = {
                title: 'Error',
                color: 16711680,
                description: 'An error occurred while trying to unban the member.',
                timestamp: new Date(),
            };
            await interaction.reply({
                embeds: [errEmbed],
                ephemeral: true,
            });
        }
    },
};
