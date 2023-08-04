const { SlashCommandBuilder, PermissionFlagsBits, ModalBuilder, TextInputBuilder, TextInputStyle, ActionRowBuilder, EmbedBuilder } = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("say")
    .setDescription("Says something by the bot")
    .setDMPermission(false)
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageMessages)
    .addChannelOption(options => options
      .setName("channel")
      .setDescription("The channel you want to send the message")
      .setRequired(false))
    .addStringOption(options => options
      .setName("embed")
      .setDescription("Embed on/off")
      .setRequired(false)
      .addChoices({ name: 'On', value: 'on' }, { name: 'Off', value: 'off' })
    ),

  async execute(interaction) {
    const channel = interaction.options.getChannel("channel") || interaction.channel;
    const embed = interaction.options.getString("embed") || "off";

    const sayModal = new ModalBuilder()
      .setCustomId("say")
      .setTitle("Say something through the bot");

    if (embed === "off") {
      const sayInput = new TextInputBuilder()
        .setCustomId("say")
        .setLabel("Say something")
        .setPlaceholder("Type something...")
        .setStyle(TextInputStyle.Paragraph)
        .setRequired(true);

      const actionRow = new ActionRowBuilder()
        .addComponents(sayInput);

      sayModal.addComponents(actionRow);

    } else if (embed === "on") {
      const titleInput = new TextInputBuilder()
        .setCustomId("embedTitle")
        .setLabel("Title")
        .setPlaceholder("Enter the embed title")
        .setStyle(TextInputStyle.Short)
        .setRequired(false);

      const titleUrlInput = new TextInputBuilder()
        .setCustomId("embedTitleUrl")
        .setLabel("Title URL")
        .setPlaceholder("Enter the embed title URL")
        .setStyle(TextInputStyle.Short)
        .setRequired(false);

      const imageUrlInput = new TextInputBuilder()
        .setCustomId("embedImageURL")
        .setLabel("Image")
        .setPlaceholder("Enter the embed image URL (e.g., https://example.com/image.jpg)")
        .setStyle(TextInputStyle.Short)
        .setRequired(false)

      const thumbnailUrlInput = new TextInputBuilder()
        .setCustomId("embedThumbnailURL")
        .setLabel("Thumbnail")
        .setPlaceholder("Enter the embed thumbnail URL (e.g., https://example.com/thumbnail.jpg)")
        .setStyle(TextInputStyle.Short)
        .setRequired(false)
      
      const descriptionInput = new TextInputBuilder()
        .setCustomId("embedDescription")
        .setLabel("Description")
        .setPlaceholder("Enter the embed description")
        .setStyle(TextInputStyle.Paragraph)
        .setRequired(true);


      sayModal.addComponents(
        new ActionRowBuilder().addComponents(titleInput),
        new ActionRowBuilder().addComponents(titleUrlInput),
        new ActionRowBuilder().addComponents(imageUrlInput),
        new ActionRowBuilder().addComponents(thumbnailUrlInput),
        new ActionRowBuilder().addComponents(descriptionInput)
      );
    }

    await interaction.showModal(sayModal);

    try {
      const response = await interaction.awaitModalSubmit({ time: 300000 });

      if (embed === "on") {
        const embedBuilder = new EmbedBuilder()
        .setColor('Random')
        .setTimestamp()
        .setFooter({ text: `Requested by ${interaction.user.username}`, iconURL: 'https://cdn.discordapp.com/avatars/772939602863587368/13e8a9704032f64926ac7f2487110f7b.png' });


        const embedTitle = response.fields.getTextInputValue("embedTitle");
        const embedTitleUrl = response.fields.getTextInputValue("embedTitleUrl");
        const embedImageURL = response.fields.getTextInputValue("embedImageURL");
        const embedThumbnailURL = response.fields.getTextInputValue("embedThumbnailURL");
        const embedDescription = response.fields.getTextInputValue("embedDescription");

        if (embedTitle) embedBuilder.setTitle(embedTitle);
        if (embedTitleUrl) {
          if (/^https?:\/\/\S+$/.test(embedTitleUrl)) { // Validate as a URL
            embedBuilder.setURL(embedTitleUrl);
          } else {
            await response.reply({ content: "Invalid URL for the embed title.", ephemeral: true });
            return;
          }
        }
/*        if (embedAuthor) {
          if (embedAuthorUrl) {
            embedBuilder.setAuthor({ name: embedAuthor, url: embedAuthorUrl });
          } else {
            embedBuilder.setAuthor({ name: embedAuthor });
          }
        }*/
        if (embedImageURL) {
          if (/^https?:\/\/\S+\.(?:jpg|jpeg|gif|png)(?:\?.+)?$/.test(embedImageURL)) {
            embedBuilder.setImage(embedImageURL);
          } else {
            await response.reply({ content: "Invalid image URL for the embed image.", ephemeral: true });
            return;
          }
        }
        if (embedThumbnailURL) {
          if (/^https?:\/\/\S+\.(?:jpg|jpeg|gif|png)(?:\?.+)?$/.test(embedThumbnailURL)) {
            embedBuilder.setThumbnail(embedThumbnailURL);
          } else {
            await response.reply({ content: "Invalid image URL for the embed thumbnail.", ephemeral: true });
            return;
          }
        }
        if (embedDescription) embedBuilder.setDescription(embedDescription);

        await channel.send({ embeds: [embedBuilder] });
      } else {
        await channel.send(response.fields.getTextInputValue("say"));
      }

      await response.reply({ content: "Your message has been successfully sent", ephemeral: true });
    } catch (error) {
      console.error(error);
      return;
    }
  }
};
