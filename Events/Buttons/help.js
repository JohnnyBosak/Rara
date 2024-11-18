const { ActionRowBuilder, StringSelectMenuBuilder, EmbedBuilder, ButtonBuilder, ButtonStyle, ComponentType } = require('discord.js');
const { menu } = require('./help.json');

module.exports = {
  name: "interactionCreate",

  async execute(interaction) {
    if (!interaction.isStringSelectMenu()) return;
    if (interaction.customId === 'selecthelp') {
      let choices = "";

      interaction.values.forEach(async (value) => {
        choices += `${value}`;

        if (value === 'helpcenter') {
          await interaction.update({ embeds: [helpCenterEmbed()] });
        }

        if (value === 'giveaway') {
          await interaction.update({ embeds: [giveawayEmbed()] });
        }

        if (value === 'emoji') {
          await interaction.update({ embeds: [emojiEmbed()] });
        }


        if (value === 'image') {
          await interaction.update({ embeds: [imageEmbed()] });
        }

        if (value === 'audio') {
          await interaction.update({ embeds: [audioEmbed()] });
        }

        if (value === 'entertainment') {
          await interaction.update({ embeds: [entertainmentEmbed()] });
        }

        if (value === 'extra') {
          await interaction.update({ embeds: [extraEmbed()] });
        }


        if (value === 'botmanagement') {
          await interaction.update({ embeds: [botManagementEmbed()] });
        }

        if (value === 'moderation') {

          const commandButtons = new ActionRowBuilder()
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
            );

          const commandButtons1 = new ActionRowBuilder()
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
            );

          await interaction.update({ embeds: [moderationEmbed1()], components: [commandButtons] });
          const commandsMessage = interaction.message;
          const collector = commandsMessage.createMessageComponentCollector({ componentType: ComponentType.Button });

          collector.on('collect', async i => {
            if (i.customId === 'spacer') {
              return;
            }

            if (i.customId === 'helpcenterbutton') {
              await i.update({ embeds: [helpCenterEmbed()], components: [helpSelectMenu()] });
            }

            if (i.customId === 'pageleft') {
              await i.update({ embeds: [moderationEmbed1()], components: [commandButtons] });
            }

            if (i.customId === 'pageright') {
              await i.update({ embeds: [moderationEmbed2()], components: [commandButtons1] });
            }

            if (i.customId === 'helpcenterbutton1') {
              await i.update({ embeds: [helpCenterEmbed()], components: [helpSelectMenu()] });
            }

            if (i.customId === 'pageright1') {
              await i.update({ embeds: [moderationEmbed2()], components: [commandButtons1] });
            }

            if (i.customId === 'pageleft1') {
              await i.update({ embeds: [moderationEmbed1()], components: [commandButtons] });
            }
          });
        }
      });
    }
  },
  helpCenterEmbed,
  helpSelectMenu
};

// Function to get the Help Center embed
function helpSelectMenu() {
  return new ActionRowBuilder()
    .addComponents(
      new StringSelectMenuBuilder()
        .setMinValues(1)
        .setMaxValues(1)
        .setCustomId('selecthelp')
        .setPlaceholder('• Select a category')
        .addOptions(menu),
    );
}

// Function to get the Help Center embed
function helpCenterEmbed() {
  return new EmbedBuilder()
    .setDescription(`Hi! I'm Rara, your charming companion ready to sprinkle some magic in your server! ✨ Let's dive into the wonderland of my features and discover what I can bring to your community.\n\n<:list:1191853632660983829> Listed down below is a quick overview of what I can do:\n\n<:check:1191853535638335498> Warm Greetings\r<:check:1191853535638335498> Music with a Hint of Whimsy\r<:check:1191853535638335498> Moderation\r<:check:1191853535638335498> Extravaganza Entertainment\r<:check:1191853535638335498> Polls for Decision-making\r<:check:1191853535638335498> Verification\n\nThese are just a glimpse of the many features I offer. Ready to explore and elevate your server experience? 🌟.`)
    .setColor('Orange')
    .setThumbnail('https://i.ibb.co/0J6sDfq/Rara.png');
}

// Function to get the Giveaway embed
function giveawayEmbed() {
  return new EmbedBuilder()
    .setDescription(`
      <:console:1191791719818203238> </giveaway start:1115039461043081247>\r
      <:note:1191791899690934292> Create a giveaway.\n
      <:console:1191791719818203238> </giveaway edit:1115039461043081247>\r
      <:note:1191791899690934292> Edit the details of an ongoing giveaway.\n
      <:console:1191791719818203238> </giveaway end:1115039461043081247>\r
      <:note:1191791899690934292> End a running giveaway and announce the winners.\n
      <:console:1191791719818203238> </giveaway reroll:1115039461043081247>\r
      <:note:1191791899690934292> Reroll the winners of a concluded giveaway.
      `)
    .setColor('Blurple')
    .setTitle('> Manage Giveaways')
    .setFooter({ text: `Giveaway: Page 1` });
}

// Function to get the Emoji Commands embed
function emojiEmbed() {
  return new EmbedBuilder()
    .setDescription(`
<:console:1191791719818203238> </emoji add:1191478213721989131>\r
<:note:1191791899690934292> Add new emojis to your server.\n
<:console:1191791719818203238> </emoji edit:1191478213721989131>\r
<:note:1191791899690934292> Edit the name of an existing emoji on your server.\n
<:console:1191791719818203238> </emoji remove:1191478213721989131>\r
<:note:1191791899690934292> Remove emojis from your server.\n
`)
    .setColor('Yellow')
    .setTitle('> Manage Emojis & Stickers')
    .setFooter({ text: `Emojis & Stickers: Page 1` });
}

// Function to get the Image Commands embed
function imageEmbed() {
  return new EmbedBuilder()
    .setDescription(`
<:console:1191791719818203238> </avatar:1264318846542676061>\r
<:note:1191791899690934292> Display member's avatar in different formats.\n
<:console:1191791719818203238> </banner:1115039460908880015>\r
<:note:1191791899690934292> Create a cool banner for an user.\n
<:console:1191791719818203238> </ai prodia:1246786481591160863>\r
<:note:1191791899690934292> Generate images using Prodia.\n
<:console:1191791719818203238> </image:1176330987827904552>\r
<:note:1191791899690934292> Get an image from wallhaven.\n
`)
    .setColor('#1abc9c')
    .setTitle('> Images and Art')
    .setFooter({ text: `Images & Arts: Page 1` });
}

// Function to get the Audio Commands embed
function audioEmbed() {
  return new EmbedBuilder()
    .setDescription(`
      <:console:1191791719818203238> </play:1134503326629769360>\r
      <:note:1191791899690934292> Play music in a voice channel.\n
      <:console:1191791719818203238> </radio:1233178480372351069>\r
      <:note:1191791899690934292> Play a radio station in a voice channel.\n
      <:console:1191791719818203238> </yosoundboard:1115039460908880013>\r
      <:note:1191791899690934292> Play an audio soundboard in a voice channel.\n
      <:console:1191791719818203238> </vote-kick:1115039460908880018>\r
      <:note:1191791899690934292> Kick a member from a voice channel.\n
      `)
    .setColor('Fuchsia')
    .setTitle('> Audio Commands')
    .setFooter({ text: `Audio: Page 1` });
}

// Function to get the Entertainment Commands embed
function entertainmentEmbed() {
  return new EmbedBuilder()
    .setDescription(`
  <:console:1191791719818203238> </chatgpt:1191153313484374016>\r
  <:note:1191791899690934292> Chat with ChatGPT.\n
  <:console:1191791719818203238> </emoji mixer:1191478213721989131>\r
  <:note:1191791899690934292> Mix two emojis together.\n
  <:console:1191791719818203238> </memberinfo:1115039460908880017>\r
  <:note:1191791899690934292> Get information about an user.\n
  <:console:1191791719818203238> </movie:1172623507557978173>\r
  <:note:1191791899690934292> Get information about a movie.\n
  <:console:1191791719818203238> </poll:1115039460908880016>\r
  <:note:1191791899690934292> Create a poll.\n
  <:console:1191791719818203238> </roast:1155881692792377364>\r
  <:note:1191791899690934292> Roast an user.\n
  <:console:1191791719818203238> </say:1125070075670560778>\r
  <:note:1191791899690934292> Make the bot say something.
  `)
    .setColor('White')
    .setTitle('> Fun commands')
    .setFooter({ text: `Entertainment: Page 1` });
}

// Function to get the Extra Commands embed
function extraEmbed() {
  return new EmbedBuilder()
    .setDescription(`
      <:cursor:1192089502299201609> stealsticker\r
      <:note:1191791899690934292> Steal a sticker sent in the chat.\n
      <:cursor:1192089502299201609> thread\r
      <:note:1191791899690934292> Create a thread from a message sent in the chat.\n
      <:cursor:1192089502299201609> virus-total\r
      <:note:1191791899690934292> Analyse suspicious URLs sent in the chat.\n
      `)
    .setColor('#000000')
    .setTitle('> Extra Commands')
    .setFooter({ text: `Extra commands: Page 1` });
}

// Function to get Bot Management Commands embed
function botManagementEmbed() {
  return new EmbedBuilder()
    .setDescription(`
      <:console:1191791719818203238> </rara:1115039461043081249>\r
      <:note:1191791899690934292> Manage Rara's profile (Dev only).\n
      <:console:1191791719818203238> </database:1138814047307972628>\r
      <:note:1191791899690934292> Manage Rara's database (Dev only).\n
      <:console:1191791719818203238> </reload:1115039461043081249>\r
      <:note:1191791899690934292> Reload Rara's events/commands (Dev only).\n
      <:console:1191791719818203238> </ping:1115039460908880014>\r
      <:note:1191791899690934292> Check the bot's latency.\n
      <:console:1191791719818203238> </invite:1190759846501421137>\r
      <:note:1191791899690934292> Get Rara's invite link.\n
      `)
    .setColor('DarkRed')
    .setTitle('> Bot Management Commands')
    .setFooter({ text: `Extra commands: Page 1` });
}

// Function to get the Moderation Commands embed
function moderationEmbed1() {
  return new EmbedBuilder()
    .setDescription(`
    <:console:1191791719818203238> </automod flagged-words:1115039461043081248>\r
    <:note:1191791899690934292> Configure automatic moderation for flagged words.\n
    <:console:1191791719818203238> </automod keyword:1115039461043081248>\r
    <:note:1191791899690934292> Manage keyword-based automatic moderation.\n
    <:console:1191791719818203238> </automod mention-spam:1115039461043081248>\r
    <:note:1191791899690934292> Manage automatic moderation for mention spam.\n
    <:console:1191791719818203238> </automod spam-messages:1115039461043081248>\r
    <:note:1191791899690934292> Manage automatic moderation for spam messages.\n
    <:console:1191791719818203238> </clear:1191037217708195902>\r
    <:note:1191791899690934292> Delete multiple messages in a channel.\n
    <:console:1191791719818203238> </setup clear_log:1191037217708195901>\r
    <:note:1191791899690934292> Configure the logging channel for the /clear command.\n
    <:console:1191791719818203238> </setup ban_log:1191037217708195901>\r
    <:note:1191791899690934292> Set up a ban/unban log channel.\n
    <:console:1191791719818203238> </setup booster:1191037217708195901>\r
    <:note:1191791899690934292> Configure boost logging system for your guild.\n
    <:console:1191791719818203238> </setup welcome:1191037217708195901>\r
    <:note:1191791899690934292> Configure welcome logging system for your guild.\n
    `)
    .setColor('Red')
    .setTitle('> Server Moderation')
    .setFooter({ text: `Moderation: Page 1` });
}

function moderationEmbed2() {
  return new EmbedBuilder()
    .setDescription(`
<:console:1191791719818203238> </ban:1206662524502802443>\r
<:note:1191791899690934292> Ban a member from the server\n
<:console:1191791719818203238> </kick:1206662524502802442>\r
<:note:1191791899690934292> Kick a member from the server\n
<:console:1191791719818203238> </timeout:1115039460908880019>\r
<:note:1191791899690934292> Restrict a member's ability to communicate temporarily\n
<:console:1191791719818203238> </unban:1206663971977957436>\r
<:note:1191791899690934292> Unban a member\n
`)
    .setColor('Red')
    .setTitle('> Member Moderation')
    .setFooter({ text: `Moderation: Page 2` });
}