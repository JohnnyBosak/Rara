const { EmbedBuilder } = require("discord.js");

const boosterLogDatabase = require("../../Schemas/BoosterLog");

module.exports = {
  name: "guildMemberUpdate",
  async execute(oldMember, newMember, client) {

    const guildConfig = await boosterLogDatabase.findOne({ Guild: newMember.guild.id });
    if (!guildConfig) return;

    const boostAnnounceChannel = newMember.guild.channels.cache.get(guildConfig.AnnouncementChannel);
    const boostLogChannel = newMember.guild.channels.cache.get(guildConfig.logChannel);

    if (!boostAnnounceChannel && !boostLogChannel) return;

    const format = {
      0: "No Level",
      1: "Level 1",
      2: "Level 2",
      3: "Level 3",
    };

    const boostLevel = format[newMember.guild.premiumTier];

    if (oldMember.roles.cache.size !== newMember.roles.cache.size) {
      if (
        !oldMember.roles.cache.has(
          newMember.guild.roles.premiumSubscriberRole.id
        ) &&
        newMember.roles.cache.has(
          newMember.guild.roles.premiumSubscriberRole.id
        )
      ) {
        // Boost Announcement embed message
        if (boostAnnounceChannel) {
          const boostAnnounceEmbed = new EmbedBuilder()
            .setAuthor({
              name: `🎉🎉 BOOSTER PARTY 🎉🎉`,
              iconURL: newMember.guild.iconURL({ size: 1024 }),
            })
            .setDescription(
              `> <@${newMember.user.id}>, You are Awsome and Amazing!\n\n> Thank you for Boosting the server <a:WumpusNitroBoost:1177735188416057415>\n> Enjoy rocking ${newMember.guild.roles.premiumSubscriberRole} exclusive role and other fantastic Perks! <:boost:1177742281172844614>\n\n> \<a:boost:1177718097659056199> Total Boost: <:discordboost:1102409233632333935> ${newMember.guild.premiumSubscriptionCount} Boost | ${boostLevel}`
            )
            .setThumbnail(newMember.user.displayAvatarURL({ size: 1024 }))
            .setImage(
              "https://media1.giphy.com/media/3BpyyvDfffs7t22Ged/200.gif?cid=ecf05e47guwgvvuxny69e9so9k4mwq0z5wjmlu6j0yru58v7&rid=200.gif&ct=g"
            )
            .setColor("F47FFF")
            .setFooter({
              text: `${newMember.guild.name} Top Tier Supporter`,
              iconURL: newMember.user.displayAvatarURL({ size: 1024 }),
            })
            .addFields(
              {
                name: "🎉 Server Boost at:",
                value: `<t:${Math.round(
                  newMember.premiumSinceTimestamp / 1000
                )}:f> |\n<t:${Math.round(
                  newMember.premiumSinceTimestamp / 1000
                )}:R>`,
                inline: true,
              },
              {
                name: "📆 Joined Server at:",
                value: `<t:${Math.round(
                  newMember.joinedTimestamp / 1000
                )}:f> |\n<t:${Math.round(newMember.joinedTimestamp / 1000)}:R>`,
                inline: true,
              }
            )
            .setTimestamp();

          const msg = await boostAnnounceChannel.send({
            content: `${newMember} <a:Pin:764789618717097984>`,
            embeds: [boostAnnounceEmbed]
          });
          msg.react("<:boost:1177733390577959052>");
        }

        //Boost Log System
        if (boostLogChannel) {
          const boostLogEmbed = new EmbedBuilder()
            .setAuthor({
              name: `NEW Boost Detection System`,
              iconURL: client.user.displayAvatarURL(),
            })
            .addFields(
              {
                name: "💎 Nitro Booster",
                value: `${newMember.user} | ${newMember.user.tag}`,
              },
              {
                name: "🎉 Server Boost at:",
                value: `<t:${Math.round(
                  newMember.premiumSinceTimestamp / 1000
                )}:f> | <t:${Math.round(
                  newMember.premiumSinceTimestamp / 1000
                )}:R>`,
                inline: true,
              },
              {
                name: "⏰ Account Created at:",
                value: `<t:${Math.round(
                  newMember.user.createdTimestamp / 1000
                )}:f> | <t:${Math.round(
                  newMember.user.createdTimestamp / 1000
                )}:R>`,
                inline: true,
              },
              {
                name: "📆 Joined Server at:",
                value: `<t:${Math.round(
                  newMember.joinedTimestamp / 1000
                )}:f> | <t:${Math.round(newMember.joinedTimestamp / 1000)}:R>`,
                inline: true,
              },
              {
                name: "💜 Total Boost",
                value: `${newMember.guild.premiumSubscriptionCount} Boost | ${boostLevel}`,
                inline: false,
              },
              {
                name: "✅ Assigned Role:",
                value: `${newMember.guild.roles.premiumSubscriberRole} | ${newMember.guild.roles.premiumSubscriberRole.name} | ${newMember.guild.roles.premiumSubscriberRole.id}`,
                inline: false,
              }
            )
            .setThumbnail(newMember.user.displayAvatarURL({ size: 1024 }))
            .setColor(newMember.guild.members.me.displayHexColor)
            .setFooter({
              text: `ID: ${newMember.user.id}`,
              iconURL: newMember.guild.iconURL({ size: 1024 }),
            })
            .setTimestamp();

          await boostLogChannel.send({
            embeds: [boostLogEmbed]
          });
        }

        //Send DM to NEW Nitro Booster
        newMember.send({
          content: `Hey ${newMember.user.tag}, you're awesome! <a:woah:764784561539383306>\nThank you for being sexy and boosting [**__${newMember.guild.name}__**](<https://discord.com/channels/429089094690275338/538755862521446420>). We appreciate your support 💜\nEnjoy rocking **${newMember.guild.roles.premiumSubscriberRole.name}** role and other fantastic perks! 🎉\n# Stay Sexy <a:WumpusNitroBoost:1177735188416057415>`
        });
      }

      //Trigger when Member Unboost the server and remove the Nitro Booster Role
      if (
        oldMember.roles.cache.has(
          oldMember.guild.roles.premiumSubscriberRole.id
        ) &&
        !newMember.roles.cache.has(oldMember.guild.roles.premiumSubscriberRole.id)
      ) {
        if (boostLogChannel) {
          const unboostEmbedLog = new EmbedBuilder()
            .setAuthor({
              name: `NEW UnBoost or Expired Detection System`,
              iconURL: client.user.displayAvatarURL(),
            })
            .addFields(
              {
                name: "📌 UnBooster:",
                value: `${oldMember.user} | ${oldMember.user.tag}`,
              },
              {
                name: "⏰ Account Created at:",
                value: `<t:${Math.round(
                  oldMember.user.createdTimestamp / 1000
                )}:f> | <t:${Math.round(
                  oldMember.user.createdTimestamp / 1000
                )}:R>`,
                inline: true,
              },
              {
                name: "📆 Joined Server at:",
                value: `<t:${Math.round(
                  oldMember.joinedTimestamp / 1000
                )}:f> | <t:${Math.round(oldMember.joinedTimestamp / 1000)}:R>`,
                inline: true,
              },
              {
                name: "💜 Total Boost:",
                value: `${oldMember.guild.premiumSubscriptionCount} Boost | ${boostLevel}`,
                inline: false,
              },
              {
                name: "❌ Removed Role:",
                value: `${oldMember.guild.roles.premiumSubscriberRole} | ${oldMember.guild.roles.premiumSubscriberRole.name} | ${oldMember.guild.roles.premiumSubscriberRole.id}`,
                inline: false,
              }
            )
            .setThumbnail(oldMember.user.displayAvatarURL({ size: 1024 }))
            .setColor(oldMember.guild.members.me.displayHexColor)
            .setFooter({
              text: `ID: ${oldMember.user.id}`,
              iconURL: oldMember.guild.iconURL({ size: 1024 }),
            })
            .setTimestamp();

          await boostLogChannel.send({
            embeds: [unboostEmbedLog],
          });
        }

        //Send DM to NEW UnBooster
        oldMember.send({
          content: `Hello ${oldMember.user.tag}\n\nWe regret to inform you that your Nitro Boost for [**__${newMember.guild.name}__**](<https://discord.com/channels/429089094690275338/538755862521446420>) has expired. <:AquaCry:755828551793508472> As a result, you've temporarily lost access to the special perks and exclusive **${oldMember.guild.roles.premiumSubscriberRole.name}** role.\n\nNo worries! 🎉 You can regain these awesome benefits by boosting again. Your support is greatly appreciated! 💜<:boost:1177733390577959052>`
        });
      }
    }
  },
};
