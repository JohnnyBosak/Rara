const { ActionRowBuilder, Events, StringSelectMenuBuilder, ButtonBuilder, ButtonStyle, EmbedBuilder, ComponentType } = require('discord.js');

module.exports = {
name: "interactionCreate",

async execute(interaction) {

    const helprow2 = new ActionRowBuilder()
        .addComponents(

            new StringSelectMenuBuilder()
            .setMinValues(1)
            .setMaxValues(1)
            .setCustomId('selecthelp')
            .setPlaceholder('• Select a menu')
            .addOptions(
                {
                    label: '• Help Center',
                    description: 'Navigate to the Help Center.',
                    value: 'helpcenter',
                },

                {
                    label: '• Tickets',
                    description: 'Navigate to the Tickets page.',
                    value: 'ticketpage'
                },

                {
                    label: '• Commands',
                    description: 'Navigate to the Commands help page.',
                    value: 'commands',
                },
            ),
        );

    if (!interaction.isStringSelectMenu()) return;
    if (interaction.customId === 'selecthelp') {
        let choices = "";

        const centerembed = new EmbedBuilder()
        .setColor('Green')
        .setTimestamp()
        .setTitle('> Help Center')
        .setAuthor({ name: `🧩 Help Toolbox` })
        .setFooter({ text: `🧩 Help Center` })
        .addFields({ name: `• Help Center`, value: `> Displays this menu.` })
        .addFields({ name: `• Tickets`, value: `> Get information on tickets.` })
        .addFields({ name: `• Commands`, value: `> Get information on commands.` })

        interaction.values.forEach(async (value) => {
            choices += `${value}`;

            if (value === 'helpcenter') {

                await interaction.update({ embeds: [centerembed] });
            }

            if (value === 'ticketpage') {

                const ticketembed = new EmbedBuilder()
                    .setColor('Green')
                    .setTimestamp()
                    .setTitle('> Ticket Page')
                    .setAuthor({ name: `🧩 Help Toolbox` })
                    .setFooter({ text: `🧩 Ticket Page` })
                    .addFields({ name: `• Tickets`, value: `> Tickets are a cool way of contacting \n> support, to create on use **/ticket**!` });

                await interaction.update({ embeds: [ticketembed] });
            }

            if (value === 'commands') {

                const commandpage1 = new EmbedBuilder()
                .setColor('Green')
                .setTimestamp()
                .setTitle('> Commands Page 1')
                .setAuthor({ name: `🧩 Help Toolbox` })
                .setFooter({ text: `🧩 Commands: Page 1` })
                .addFields({ name: `• /advanced-help`, value: `> Opens up an advanced help guide!` })
                .addFields({ name: `• Placeholder name..`, value: `> Place holder command..` })
                .addFields({ name: `• Placeholder name..`, value: `> Place holder command..` })
                .addFields({ name: `• Placeholder name..`, value: `> Place holder command..` })
                .addFields({ name: `• Placeholder name..`, value: `> Place holder command..` })

                const commandpage2 = new EmbedBuilder()
                .setColor('Green')
                .setTimestamp()
                .setTitle('> Commands Page 2')
                .setAuthor({ name: `🧩 Help Toolbox` })
                .setFooter({ text: `🧩 Commands: Page 2` })
                .addFields({ name: `• /help`, value: `> A non advanced help command :(` })
                .addFields({ name: `• Placeholder name..`, value: `> Place holder command..` })
                .addFields({ name: `• Placeholder name..`, value: `> Place holder command..` })
                .addFields({ name: `• Placeholder name..`, value: `> Place holder command..` })
                .addFields({ name: `• Placeholder name..`, value: `> Place holder command..` })

                const commandbuttons = new ActionRowBuilder()
                .addComponents(
                    new ButtonBuilder()
                    .setCustomId('helpcenterbutton')
                    .setLabel('Help Center')
                    .setStyle(ButtonStyle.Success),

                    new ButtonBuilder()
                    .setCustomId('spacer')
                    .setLabel('<>')
                    .setDisabled(true)
                    .setStyle(ButtonStyle.Secondary),

                    new ButtonBuilder()
                    .setCustomId('pageleft')
                    .setLabel('◀')
                    .setDisabled(true)
                    .setStyle(ButtonStyle.Success),

                    new ButtonBuilder()
                    .setCustomId('pageright')
                    .setLabel('▶')
                    .setStyle(ButtonStyle.Success)
                )

                const commandbuttons1 = new ActionRowBuilder()
                    .addComponents(
                        new ButtonBuilder()
                        .setCustomId('helpcenterbutton1')
                        .setLabel('Help Center')
                        .setStyle(ButtonStyle.Success),

                        new ButtonBuilder()
                        .setCustomId('spacer1')
                        .setLabel('<>')
                        .setDisabled(true)
                        .setStyle(ButtonStyle.Secondary),

                        new ButtonBuilder()
                        .setCustomId('pageleft1')
                        .setLabel('◀')
                        .setDisabled(false)
                        .setStyle(ButtonStyle.Success),

                        new ButtonBuilder()
                        .setCustomId('pageright1')
                        .setDisabled(true)
                        .setLabel('▶')
                        .setStyle(ButtonStyle.Success)
                    )

                interaction.update({ embeds: [commandpage1], components: [commandbuttons] });
                const commandsmessage = interaction.message;
                const collector = commandsmessage.createMessageComponentCollector({ componentType: ComponentType.Button });

                collector.on('collect', async i => {
            
                    if (i.customId === 'spacer') {
                        
                        return;
                
                    }
                
                    if (i.customId === 'helpcenterbutton') {
                
                        await i.update({ embeds: [centerembed], components: [helprow2] });
                
                    }
                
                    if (i.customId === 'pageleft') {
                
                        await i.update({ embeds: [commandpage1], components: [commandbuttons] });
                
                    }
                
                    if (i.customId === 'pageright') {
                
                        await i.update({ embeds: [commandpage2], components: [commandbuttons1] });
                
                    }
                
                    if (i.customId === 'helpcenterbutton1') {
                
                        await i.update({ embeds: [centerembed], components: [helprow2] });
                
                    }
                
                    if (i.customId === 'pageright1') {
                
                        await i.update({ embeds: [commandpage2], components: [commandbuttons1] });
                
                    }
                
                    if (i.customId === 'pageleft1') {
                
                        await i.update({ embeds: [commandpage1], components: [commandbuttons] });
                
                    }
                })
            }
        })
    }
}
}
