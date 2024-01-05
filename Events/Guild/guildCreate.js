const { EmbedBuilder, ButtonBuilder, ActionRowBuilder } = require("discord.js");

module.exports = {
  name: "guildCreate",

  async execute(guild) {
    try {
      const owner = await guild.members.fetch(guild.ownerId);

      if (owner && !owner.user.bot) {
        const embed = new EmbedBuilder()
          .setColor('#0099ff')
          .setTitle('Thank You for Adding Me!')
          .setDescription(`<:yay:1191782575203680388> Thanks for adding me to your server, ${owner.user.username}!`)
          .setThumbnail('https://i.ibb.co/7bVH49g/Rara.jpg')
          .addFields(
            { name: 'How to Use Me', value: '🔗 You can interact with me using slash commands\n<:slash:1191744484866793492> Check my commands using </advanced-help:1124665843322736781>\n🚀 Explore my features and have fun with the server!' },
// Add more fields as needed
          );
        owner.send({ embeds: [embed], components: [buttons] });
        console.log(`Sent thank-you message to ${owner.user.tag}`);
      }
    } catch (error) {
      console.error(`Error sending thank-you message: ${error.message}`);
    }
  }
};

const buttons = new ActionRowBuilder()
.addComponents(
  new ButtonBuilder()
    .setLabel('Invite')
    .setStyle(5)
    .setURL('https://discord.com/oauth2/authorize?client_id=772939602863587368&permissions=68169720393463&scope=bot'),

  new ButtonBuilder()
    .setLabel('Suppport')
    .setStyle(5)
    .setURL('https://discord.gg/8NZTzqDqqt')
)
