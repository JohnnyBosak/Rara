const { SlashCommandBuilder, ChatInputCommandInteraction, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle, PermissionsBitField, ChannelType } = require('discord.js');
const suggestion = require('../../Schemas/Suggestion');
const formatResults = require('../../Utils/formatResults');

module.exports = {
    data: new SlashCommandBuilder()
    .setName('poll')
    .setDescription('Create a poll.')
    .setDMPermission(false)
    //.setDefaultMemberPermissions(PermissionFlagsBits.ManageMessages)
    .addStringOption(option => option.setName('suggestion').setDescription('Input a suggestion.').setRequired(true))
    .addStringOption(option => option.setName('title').setDescription('Input a title for your suggestion.'))
    .addChannelOption(option => option.setName('channel').setDescription('Input a channel.').addChannelTypes(ChannelType.GuildText)),
  /** 
  *
  * @param {ChatInputCommandInteraction} interaction
  */
    async execute (interaction, client) {

    const { options } = interaction;
    const Data = await suggestion.findOne({ GuildID: interaction.guild.id });
    const suggestTitle = options.getString('title') || null;
    const suggestmsg = options.getString('suggestion');
    const schannel = options.getChannel('channel') || interaction.channel;

                const suggestionchannel = interaction.guild.channels.cache.get(schannel.id);

                const num1 = Math.floor(Math.random() * 256);
                const num2 = Math.floor(Math.random() * 256);
                const num3 = Math.floor(Math.random() * 256);
                const num4 = Math.floor(Math.random() * 256);
                const num5 = Math.floor(Math.random() * 256);
                const num6 = Math.floor(Math.random() * 256);
                const SuggestionID = `${num1}${num2}${num3}${num4}${num5}${num6}`;
        
                const suggestionembed = new EmbedBuilder()
                .setAuthor({ name: `${interaction.user.username} | ${interaction.guild.name}'s Poll System `})
                .setColor('Blurple')
                .setThumbnail(interaction.user.displayAvatarURL({ size: 512 }))
                .setTitle(suggestTitle)
                .setDescription(`> \`${suggestmsg}\``)
                .setTimestamp()
                .addFields({ name: `Votes`, value: formatResults() })
                .setFooter({ text: `Suggestion ID: ${SuggestionID}`, iconURL: interaction.guild.iconURL({ size: 256, dynamic: true })});

                const upvotebutton = new ButtonBuilder()
                .setCustomId('upv')
                .setEmoji('<:tup:1162598259626352652>')
                .setLabel('Upvote (0)')
                .setStyle(ButtonStyle.Primary)

                const downvotebutton = new ButtonBuilder()
                .setCustomId('downv')
                .setEmoji('<:tdown:1162598331390889994>')
                .setLabel('Downvote (0)')
                .setStyle(ButtonStyle.Primary)
        
                const totalvotesbutton = new ButtonBuilder()
                .setCustomId('totalvotes')
                .setEmoji('💭')
                .setLabel('Votes')
                .setStyle(ButtonStyle.Secondary)

                const btnrow = new ActionRowBuilder().addComponents(upvotebutton, downvotebutton, totalvotesbutton);
        
                const button2 = new ActionRowBuilder()
                .addComponents(
                    new ButtonBuilder()
                    .setCustomId('appr')
                    .setEmoji('<a:AUSC_checked:1011088709266985110>')
                    .setLabel('Approve')
                    .setStyle(ButtonStyle.Success),
        
                    new ButtonBuilder()
                    .setCustomId('rej')
                    .setEmoji('<a:rejected:1162622460835922043>')
                    .setLabel('Reject')
                    .setStyle(ButtonStyle.Danger)
                )

                await interaction.reply({ content: `Your suggestion has been submitted in ${suggestionchannel}!`, ephemeral: true });
                const msg = await suggestionchannel.send({ embeds: [suggestionembed], components: [btnrow, button2] });
                msg.createMessageComponentCollector();

                await suggestion.create({
                    GuildID: interaction.guild.id,
                    ChannelID: suggestionchannel.id,
                    Msg: msg.id,
                    AuthorID: interaction.user.id,
                    upvotes: 0,
                    downvotes: 0,
                    Upmembers: [],
                    Downmembers: []
                })
    },
};
