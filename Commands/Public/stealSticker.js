const { ContextMenuInteraction, ContextMenuCommandBuilder, ApplicationCommandType, EmbedBuilder } = require("discord.js");

module.exports = {
  data: new ContextMenuCommandBuilder()
    .setName("stealsticker")
    .setType(ApplicationCommandType.Message),
  /**
   * 
   * @param {ContextMenuInteraction} interaction 
   */
  async execute(interaction) {
    try {
      await interaction.reply({ content: `<a:RemSpin:1117793586390515763> Fetching sticker..` });

      const message = await interaction.channel.messages.fetch(interaction.targetId);
      const sticker = message.stickers.first();

      if (!sticker) return await interaction.editReply({ content: `<:akko:748932842670653480> That message doesn't contain a sticker` });

      if (sticker.url.endsWith('.json')) return await interaction.editReply(`<:akko:748932842670653480> not a valid sticker file...`);

      const stickerURL = sticker.url.replace('cdn','media').replace('com','net');
      const embedMessage = new EmbedBuilder()
        .setColor('#ABB8C3')
        .setImage(stickerURL)
        .setTitle(sticker.name)
        .setURL(stickerURL)
        .addFields(
          { name: 'Sticker Description', value: sticker.description || 'none', "inline": true },
          { name: 'Sticker Tags', value: sticker.tags || 'none', "inline": true }
        )
        .setTimestamp()
        .setFooter({ text: 'Rara#4191', iconURL: 'https://cdn.discordapp.com/avatars/772939602863587368/13e8a9704032f64926ac7f2487110f7b.png' });

      await interaction.editReply({ content: `The sticker with the name **${sticker.name}** has been stolen <:ZT_Evil:878716153705410581>`, embeds: [embedMessage] });

    } catch (err) {
      console.log(err);
      await interaction.editReply({ content: '<:akko:748932842670653480> An error occurred.', ephemeral: true });
    }
  }
};
