const { ChatInputCommandInteraction, PermissionFlagsBits, SlashCommandBuilder, EmbedBuilder, AttachmentBuilder } = require("discord.js"); 

const { profileImage } = require('discord-arts');

const config = require('../../config.json');

module.exports = {
  data: new SlashCommandBuilder()
    .setName("memberinfo")
    .setDescription("View your or any member profile's informations.")
    .setDMPermission(false)
    .setDefaultMemberPermissions(PermissionFlagsBits.SendMessages)
    .addUserOption((option) => option
                 .setName("member")
                 .setDescription("View a member's information. Leave empty to view your own.")
                ),
  /** 
  *
  * @param {ChatInputCommandInteraction} interaction
  */
  async execute(interaction) {
    await interaction.deferReply();
    const member = interaction.options.getMember("member") || interaction.member;

    if (member.user.bot) return interaction.editReply({
      embeds: [
        new EmbedBuilder().setDescription("At this moment, bots are not supported for this command.")
      ],
      ephemeral: true
    });

    try {
      const fetchedMembers = await interaction.guild.members.fetch();
      
      const profileBuffer = await profileImage(member.id);
      const imageAttachment = new AttachmentBuilder(profileBuffer, { name: "profile.png"});

      const joinPosition = Array.from(fetchedMembers
                                      .sort((a, b) => a.joinedTimestamp - b.joinedTimestamp)
                                      .keys())
      .indexOf(member.id) + 1;

      const topRoles = member.roles.cache
      .sort((a, b) => b.position - a.position)
      .map((role) => role);
      //.slice(0, 3); //display 3 roles

      const userBadges = member.user.flags.toArray();

      const joinTime = parseInt(member.joinedTimestamp / 1000);
      const createdTime = parseInt(member.user.createdTimestamp / 1000);
      
      const Booster = member.premiumSince ? "<:discordboost:1102409233632333935>" : "X";
      
      const Embed = new EmbedBuilder()
      .setAuthor({name: `${member.user.tag} | General Information`, iconURL: member.displayAvatarURL()})
      .setColor(member.displayColor)
      .setDescription(`On <t:${joinTime}:D>, ${member.user.username} joined as the **${addSuffix(joinPosition)}** member of this guild.`)
      .setImage("attachment://profile.png")
      .addFields([
        {name: "Badges", value: `${addBadges(userBadges).join("")}`, inline: true},
        {name: "Booster", value: `${Booster}`, inline: true},
        {name: "Roles", value: `${topRoles.join(" ").replace("@everyone","")}`, inline: false},
        {name: "Created", value: `<t:${createdTime}:R>`, inline: true},
        {name: "Joined", value: `<t:${joinTime}:R>`, inline: true},
        {name: "Avatar", value: `[Link](${member.displayAvatarURL()})`, inline: true},
        {name: "Banner", value: `[Link](${(await member.user.fetch()).bannerURL()})`, inline: true},
      ]);

      interaction.editReply({embeds: [Embed], files: [imageAttachment]});
    } catch (error) {
      interaction.editReply({content: "An error occured" });
      throw error;
    }
  }
}

function addSuffix(number) {
  if (number % 100 >= 11 && number % 100 <= 13)
    return number + "th";

  switch(number % 10) {
    case 1: return number + "st";
    case 2: return number + "nd";
    case 3: return number + "rd";
  }
  return number + "th";
}

function addBadges(badgeNames) {
    if(!badgeNames.length) return ["X"];
  
    const badgeMap = {
        "ActiveDeveloper": "<:activedeveloper:1102409230872485918>",
        "BugHunterLevel1": "<:discordbughunter1:1102409237788901477>",
        "BugHunterLevel2": "<:discordbughunter2:1102409239521136640>",
        "PremiumEarlySupporter": "<:discordearlysupporter:1102409242062901340>",
        "Partner": "<:discordpartner:1102409248845082645>",
        "Staff": "<:discordstaff:1102409253429448826>",
        "HypeSquadOnlineHouse1": "<:hypesquadbravery:1102409258773008505>", // bravery
        "HypeSquadOnlineHouse2": "<:hypesquadbrilliance:1102409261801291796>", // brilliance
        "HypeSquadOnlineHouse3": "<:hypesquadbalance:1102409257107853323>", // balance
        "Hypesquad": "<:hypesquadevents:1102409264997351538>",
        "CertifiedModerator": "<:olddiscordmod:1102409266440183919>",
        "VerifiedDeveloper": "<:discordbotdev:1102409235242958938>",
    };

    return badgeNames.map((badgeName) => badgeMap[badgeName] || '❔');
}