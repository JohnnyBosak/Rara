const { ButtonInteraction, EmbedBuilder, ActionRowBuilder, PermissionsBitField, ButtonBuilder, ButtonStyle } = require("discord.js");

const suggestion = require('../../Schemas/Suggestion'); 
const formatResults = require('../../Utils/formatResults'); 

module.exports = {
  name: "interactionCreate",
  /** 
  *
  * @param {ButtonInteraction} interaction
  */
  async execute(interaction) {
    if (!interaction.guild) return;
    if (!interaction.message) return;
    if (!interaction.isButton) return;

    const data = await suggestion.findOne({ GuildID: interaction.guild.id, Msg: interaction.message.id });
    if (!data) return;
    const message = await interaction.channel.messages.fetch(data.Msg);

    if (interaction.customId == 'upv') {

        if (data.Upmembers.includes(interaction.user.id)) return await interaction.reply({content: `You cannot vote again! You have already sent an upvote on this suggestion.`, ephemeral: true});

        await data.Upmembers.push(interaction.user.id);
        await data.Downmembers.pull(interaction.user.id);
        
        const newEmbed = EmbedBuilder.from(message.embeds[0])
        .setFields({ name: `Votes`, value: formatResults(data.Upmembers, data.Downmembers) });

                const upvotebutton = new ButtonBuilder()
                .setCustomId('upv')
                .setEmoji('<:tup:1162598259626352652>')
                .setLabel(`Upvote (${data.Upmembers.length})`)
                .setStyle(ButtonStyle.Primary)

                const downvotebutton = new ButtonBuilder()
                .setCustomId('downv')
                .setEmoji('<:tdown:1162598331390889994>')
                .setLabel(`Downvote (${data.Downmembers.length})`)
                .setStyle(ButtonStyle.Primary)
        
                const totalvotesbutton = new ButtonBuilder()
                .setCustomId('totalvotes')
                .setEmoji('📊')
                .setLabel('Votes')
                .setStyle(ButtonStyle.Secondary)

                const btnrow = new ActionRowBuilder().addComponents(upvotebutton, downvotebutton, totalvotesbutton);

                const button2 = new ActionRowBuilder()
                .addComponents(
                    new ButtonBuilder()
                    .setCustomId('appr')
                    .setLabel('Approve')
                    .setEmoji('<a:AUSC_checked:1011088709266985110>')
                    .setStyle(ButtonStyle.Success),

                    new ButtonBuilder()
                    .setCustomId('rej')
                    .setEmoji('<a:rejected:1162622460835922043>')
                    .setLabel('Reject')
                    .setStyle(ButtonStyle.Danger)
                )
                
                await interaction.update({ embeds: [newEmbed], components: [btnrow, button2] });

                data.save();
    }

    if (interaction.customId == 'downv') {

        if (data.Downmembers.includes(interaction.user.id)) return await interaction.reply({ content: `You cannot vote again! You have already sent an downvote on this suggestion.`, ephemeral: true});

        await data.Downmembers.push(interaction.user.id);
        await data.Upmembers.pull(interaction.user.id);

        const newEmbed = EmbedBuilder.from(message.embeds[0])
        .setFields({ name: `Votes`, value: formatResults(data.Upmembers, data.Downmembers) });
        
                const upvotebutton = new ButtonBuilder()
                .setCustomId('upv')
                .setEmoji('<:tup:1162598259626352652>')
                .setLabel(`Upvote (${data.Upmembers.length})`)
                .setStyle(ButtonStyle.Primary)

                const downvotebutton = new ButtonBuilder()
                .setCustomId('downv')
                .setEmoji('<:tdown:1162598331390889994>')
                .setLabel(`Downvote ${data.Downmembers.length}`)
                .setStyle(ButtonStyle.Primary)
        
                const totalvotesbutton = new ButtonBuilder()
                .setCustomId('totalvotes')
                .setEmoji('📊')
                .setLabel('Votes')
                .setStyle(ButtonStyle.Secondary)

                const btnrow = new ActionRowBuilder().addComponents(upvotebutton, downvotebutton, totalvotesbutton);

                const button2 = new ActionRowBuilder()
                .addComponents(
                    new ButtonBuilder()
                    .setCustomId('appr')
                    .setLabel('Approve')
                    .setEmoji('<a:AUSC_checked:1011088709266985110>')
                    .setStyle(ButtonStyle.Success),

                    new ButtonBuilder()
                    .setCustomId('rej')
                    .setEmoji('<a:rejected:1162622460835922043>')
                    .setLabel('Reject')
                    .setStyle(ButtonStyle.Danger)
                )
                
                await interaction.update({ embeds: [newEmbed], components: [btnrow, button2] });

                data.save();
    }

    if (interaction.customId == 'totalvotes') {

        if (!interaction.member.permissions.has(PermissionsBitField.Flags.ModerateMembers)) return await interaction.reply({ content: `Only Admins & Staffs can use this button.`, ephemeral: true });

        let upvoters = [];
        await data.Upmembers.forEach(async member => {
            upvoters.push(`<@${member}>`)
        });

        let downvoters = [];
        await data.Downmembers.forEach(async member => {
            downvoters.push(`<@${member}>`)
        });

        const embed = new EmbedBuilder()
        .addFields({ name: `Upvoters (${upvoters.length})`, value: `> ${upvoters.join(', ').slice(0, 1020) || `No upvoters!`}`, inline: true})
        .addFields({ name: `Downvoters (${downvoters.length})`, value: `> ${downvoters.join(', ').slice(0, 1020) || `No downvoters!`}`, inline: true})
        .setColor('Random')
        .setTimestamp()
        .setFooter({ text: `💭 Vote Data`})
        .setAuthor({ name: `${interaction.guild.name}'s Suggestion System`})

        await interaction.reply({ embeds: [embed], ephemeral: true });
    }

    if (interaction.customId == 'appr') {

        const upvotebutton = new ButtonBuilder()
        .setCustomId('upv')
        .setEmoji('<:tup:1162598259626352652>')
        .setLabel('Upvote')
        .setStyle(ButtonStyle.Primary)

        const downvotebutton = new ButtonBuilder()
        .setCustomId('downv')
        .setEmoji('<:tdown:1162598331390889994>')
        .setLabel('Downvote')
        .setStyle(ButtonStyle.Primary)
        
        const totalvotesbutton = new ButtonBuilder()
        .setCustomId('totalvotes')
        .setEmoji('📊')
        .setLabel('Votes')
        .setStyle(ButtonStyle.Secondary)

        upvotebutton.setDisabled(true);
        downvotebutton.setDisabled(true);

        const btnrow = new ActionRowBuilder().addComponents(upvotebutton, downvotebutton, totalvotesbutton);
        
        if (!interaction.member.permissions.has(PermissionsBitField.Flags.ModerateMembers)) return await interaction.reply({ content: `Only Admins & Staffs can use this button.`, ephemeral: true });

        const newEmbed = EmbedBuilder.from(message.embeds[0]).setColor('Green').addFields({ name: '\u200B', value: '<a:AUSC_checked:1207349807379648573> Your suggestion has been approved!'})

        await interaction.update({ embeds: [newEmbed], components: [btnrow] });
        await data.updateOne({ Status: "Approved" });
        data.save();
    }

    if (interaction.customId == 'rej') {

        const upvotebutton = new ButtonBuilder()
        .setCustomId('upv')
        .setEmoji('<:tup:1162598259626352652>')
        .setLabel('Upvote')
        .setStyle(ButtonStyle.Primary)

        const downvotebutton = new ButtonBuilder()
        .setCustomId('downv')
        .setEmoji('<:tdown:1162598331390889994>')
        .setLabel('Downvote')
        .setStyle(ButtonStyle.Primary)
        
        const totalvotesbutton = new ButtonBuilder()
        .setCustomId('totalvotes')
        .setEmoji('📊')
        .setLabel('Votes')
        .setStyle(ButtonStyle.Secondary)

        upvotebutton.setDisabled(true);
        downvotebutton.setDisabled(true);

        const btnrow = new ActionRowBuilder().addComponents(upvotebutton, downvotebutton, totalvotesbutton);
        
        if (!interaction.member.permissions.has(PermissionsBitField.Flags.ModerateMembers)) return await interaction.reply({ content: `Only Admins & Staffs can use this button.`, ephemeral: true });

        const newEmbed = EmbedBuilder.from(message.embeds[0]).setColor('Red').addFields({ name: '\u200B', value: '<a:rejected:1207350266723176568> Your suggestion has been rejected!'})

        await interaction.update({ embeds: [newEmbed], components: [btnrow] });
        await data.updateOne({ Status: "Rejected" });
        data.save();

    }
  },
};
