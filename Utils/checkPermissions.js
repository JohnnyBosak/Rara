const { PermissionFlagsBits } = require('discord.js');

function checkPermissions(interaction, requiredPermissions) {

    const permissionMap = {
        AddReactions: { flagbit: PermissionFlagsBits.AddReactions, error: "\`Add Reactions\`" },
        Administrator: { flagbit: PermissionFlagsBits.Administrator, error: "\`Administrator\`" },
        AttachFiles: { flagbit: PermissionFlagsBits.AttachFiles, error: "\`Attach Files\`" },
        BanMembers: { flagbit: PermissionFlagsBits.BanMembers, error: "\`Ban Members\`" },
        ChangeNickname: { flagbit: PermissionFlagsBits.ChangeNickname, error: "\`Change Nickname\`" },
        Connect: { flagbit: PermissionFlagsBits.Connect, error: "\`Connect\`" },
        CreateEvents: { flagbit: PermissionFlagsBits.CreateEvents, error: "\`Create Events\`" },
        CreateGuildExpressions: { flagbit: PermissionFlagsBits.CreateGuildExpressions, error: "\`Create Expressions\`" },
        CreateInstantInvite: { flagbit: PermissionFlagsBits.CreateInstantInvite, error: "\`Create Invite\`" },
        CreatePrivateThreads: { flagbit: PermissionFlagsBits.CreatePrivateThreads, error: "\`Create Private Threads\`" },
        CreatePublicThreads: { flagbit: PermissionFlagsBits.CreatePublicThreads, error: "\`Create Public Threads\`" },
        DeafenMembers: { flagbit: PermissionFlagsBits.DeafenMembers, error: "\`Deafen Members\`" },
        EmbedLinks: { flagbit: PermissionFlagsBits.EmbedLinks, error: "\`Embed Links\`" },
        KickMembers: { flagbit: PermissionFlagsBits.KickMembers, error: "\`Kick Members\`" },
        ManageChannels: { flagbit: PermissionFlagsBits.ManageChannels, error: "\`Manage Channels\`" },
        ManageEmojisAndStickers: { flagbit: PermissionFlagsBits.ManageEmojisAndStickers, error: "\`Manage Emojis And Stickers\`" },
        ManageEvents: { flagbit: PermissionFlagsBits.ManageEvents, error: "\`Manage Events\`" },
        ManageGuild: { flagbit: PermissionFlagsBits.ManageGuild, error: "\`Manage Server\`" },
        ManageGuildExpressions: { flagbit: PermissionFlagsBits.ManageGuildExpressions, error: "\`Manage Expressions\`" },
        ManageMessages: { flagbit: PermissionFlagsBits.ManageMessages, error: "\`Manage Messages\`" },
        ManageNicknames: { flagbit: PermissionFlagsBits.ManageNicknames, error: "\`Manage Nicknames\`" },
        ManageRoles: { flagbit: PermissionFlagsBits.ManageRoles, error: "\`Manage Roles\`" },
        ManageThreads: { flagbit: PermissionFlagsBits.ManageThreads, error: "\`Manage Threads\`" },
        ManageWebhooks: { flagbit: PermissionFlagsBits.ManageWebhooks, error: "\`Manage Webhooks\`" },
        MentionEveryone: { flagbit: PermissionFlagsBits.MentionEveryone, error: "\`Mention Everyone\`" },
        ModerateMembers: { flagbit: PermissionFlagsBits.ModerateMembers, error: "\`Moderate Members\`" },
        MoveMembers: { flagbit: PermissionFlagsBits.MoveMembers, error: "\`Move Members\`" },
        MuteMembers: { flagbit: PermissionFlagsBits.MuteMembers, error: "\`Mute Members\`" },
        PrioritySpeaker: { flagbit: PermissionFlagsBits.PrioritySpeaker, error: "\`Priority Speaker\`" },
        ReadMessageHistory: { flagbit: PermissionFlagsBits.ReadMessageHistory, error: "\`Read Message History\`" },
        RequestToSpeak: { flagbit: PermissionFlagsBits.RequestToSpeak, error: "\`Request To Speak\`" },
        SendMessages: { flagbit: PermissionFlagsBits.SendMessages, error: "\`Send Messages\`" },
        SendMessagesInThreads: { flagbit: PermissionFlagsBits.SendMessagesInThreads, error: "\`Send Messages In Threads\`" },
        SendTTSMessages: { flagbit: PermissionFlagsBits.SendTTSMessages, error: "\`Send TTS Messages\`" },
        SendVoiceMessages: { flagbit: PermissionFlagsBits.SendVoiceMessages, error: "\`Send Voice Messages\`" },
        Speak: { flagbit: PermissionFlagsBits.Speak, error: "\`Speak\` in voice channel" },
        Stream: { flagbit: PermissionFlagsBits.Stream, error: "\`Video\`" },
        UseApplicationCommands: { flagbit: PermissionFlagsBits.UseApplicationCommands, error: "\`Use Application Commands\`" },
        UseEmbeddedActivities: { flagbit: PermissionFlagsBits.UseEmbeddedActivities, error: "\`Start Activities\`" },
        UseExternalEmojis: { flagbit: PermissionFlagsBits.UseExternalEmojis, error: "\`Use External Emojis\`" },
        UseExternalSounds: { flagbit: PermissionFlagsBits.UseExternalSounds, error: "\`Use External Sounds\`" },
        UseExternalStickers: { flagbit: PermissionFlagsBits.UseExternalStickers, error: "\`Use External Stickers\`" },
        UseSoundboard: { flagbit: PermissionFlagsBits.UseSoundboard, error: "\`Use Soundboard\`" },
        UseVAD: { flagbit: PermissionFlagsBits.UseVAD, error: "\`Use Voice Activity\`" },
        ViewAuditLog: { flagbit: PermissionFlagsBits.ViewAuditLog, error: "\`View Audit Log\`" },
        ViewChannel: { flagbit: PermissionFlagsBits.ViewChannel, error: "\`View Channel\`" },
        ViewCreatorMonetizationAnalytics: { flagbit: PermissionFlagsBits.ViewCreatorMonetizationAnalytics, error: "\`View Creator Monetization Analytics\`" },
        ViewGuildInsights: { flagbit: PermissionFlagsBits.ViewGuildInsights, error: "\`View Server Insights\`" }
    };

    const botPermissionsInChannel = interaction.guild.members.me.permissionsIn(interaction.channel);
    const missingPermissions = [];

    for (const requiredPermission of requiredPermissions) {
        const permissions = permissionMap[requiredPermission];

        if (!permissions || !botPermissionsInChannel.has(permissions.flagbit)) {
            missingPermissions.push(permissions.error);
        }
    }

    if (missingPermissions.length > 0) {
        return interaction.reply({
            content: `Missing permission(s): ${missingPermissions.join(", ")}. <:ZeroTwoShrug:1208885341575184494>`,
            ephemeral: true,
        });
    }

    return true; // Return null if permissions are okay
}

module.exports = { checkPermissions };