const { SlashCommandBuilder, ModalBuilder, TextInputBuilder, TextInputStyle, ActionRowBuilder, EmbedBuilder } = require("discord.js");

module.exports = {
  developer: true, 
  data: new SlashCommandBuilder()
    .setName("dm")
    .setDescription("Write a DM")
    .setDMPermission(false)
    .addUserOption(options => options
      .setName("user")
      .setDescription("The user you want to send the message to")
      .setRequired(true))
    .addStringOption(options => options
      .setName("embed")
      .setDescription("Embed on/off")
      .setRequired(false)
      .addChoices(
        { name: 'On', value: 'on' },
        { name: 'Off', value: 'off' })
    )
    .addAttachmentOption(option =>
      option.setName("attachment")
        .setDescription("The attachment you want to send")
        .setRequired(false)),

  async execute(interaction) {
    const user = interaction.options.getUser("user");
    if (user.bot) {
      await interaction.reply({
        content: "Sorry, I cannot send messages to other bots.",
        ephemeral: true
      });
      return;
    }

    const embed = interaction.options.getString("embed") || "off";
    const attachment = interaction.options.getAttachment("attachment");

    if (attachment) {
      if (attachment.size > 8 * 1024 * 1024) {
        await interaction.reply({
          content: "Sorry, the attachment size exceeds the limit (8 MB). Please use a smaller file.",
          ephemeral: true,
        });
        return;
      }
    }

    const sayModal = new ModalBuilder()
      .setCustomId("say")
      .setTitle("Say something through the bot");

    if (embed === "off") {
      const sayQuestion = new TextInputBuilder()
        .setCustomId("say")
        .setLabel("Say something")
        .setPlaceholder("Type something...")
        .setStyle(TextInputStyle.Paragraph)
        .setRequired(true);

      sayModal.addComponents(new ActionRowBuilder().addComponents(sayQuestion));
    } else if (embed === "on") {
      const modalFields = [
        ['Title', 'embedTitle', false],
        ['Title URL', 'embedTitleURL', false],
        ['Image', 'embedImageURL', false],
        ['Thumbnail', 'embedThumbnailURL', false],
        ['Description', 'embedDescription', true]
      ];

      modalFields.forEach(([label, customId, required]) => {
        const input = new TextInputBuilder()
          .setCustomId(customId)
          .setLabel(label)
          .setPlaceholder(`Enter the ${label.toLowerCase()}`)
          .setStyle(TextInputStyle[required ? "Paragraph" : "Short"])
          .setRequired(required);

        sayModal.addComponents(new ActionRowBuilder().addComponents(input));
      });
    }

    await interaction.showModal(sayModal);

    try {
      const response = await interaction.awaitModalSubmit({
        time: 300000
      });

      if (embed === "on") {
        const embedBuilder = new EmbedBuilder()
          .setColor('Random')
          .setTimestamp()
          .setFooter({
            text: `Sent by ${interaction.user.username}`,
            iconURL: interaction.user.displayAvatarURL({ format: 'png', dynamic: true })
          });

        const embedFields = [
          ['embedTitle', 'setTitle'],
          ['embedTitleURL', 'setTitleURL'],
          ['embedImageURL', 'setImage'],
          ['embedThumbnailURL', 'setThumbnail'],
          ['embedDescription', 'setDescription']
        ];

        let errorMessage = null;
        embedFields.forEach(([field, method]) => {
          const value = response.fields.getTextInputValue(field);
          if (value) {
            if (method === 'setTitle' || method === 'setDescription') {
              embedBuilder[method](value);
            }
            if (method === 'setTitleURL') {
              if (/^https?:\/\/\S+$/.test(value)) {
                embedBuilder[method](value);
              } else {
                errorMessage = `Invalid URL for the ${field}.`;
              }
            }
            if (method === 'setImage' || method === 'setThumbnail') {
              if (/^https?:\/\/\S+\.(?:jpg|jpeg|gif|png)(?:\?.+)?$/.test(value)) {
                embedBuilder[method](value);
              } else {
                errorMessage = `Invalid image URL for the ${field}.`;
              }
            }
          }
        });

        if (errorMessage !== null) {
          return response.reply({
            content: errorMessage,
            ephemeral: true
          });
        }

        try {
          await user.send({
            embeds: [embedBuilder],
            files: attachment ? [attachment] : []
          });
          await response.reply({
            content: "Your message has been successfully sent to the user's DM",
            ephemeral: true
          });
          return;
        } catch (error) {
          if (error.code === 'InteractionAlreadyReplied') {
            console.log('Interaction was already replied to.');
          } else {
            console.error(error);
            await response.reply({
              content: "Failed to send the message to the user's DM",
              ephemeral: true
            });
          }
          return;
        }
      } else {
        // Sending the plain text message to the channel
        await user.send({
          content: response.fields.getTextInputValue("say"),
          files: attachment ? [attachment] : []
        });
      }

      await response.reply({ content: "Your message has been successfully sent", ephemeral: true });
      return;
    } catch (error) {
      if (error.code === 'InteractionAlreadyReplied') {
        console.log('Interaction was already replied to.');
      } else {
        console.error(error);
        await interaction.reply({
          content: "Failed to send the message",
          ephemeral: true
        });
      }
      return;
    }
  }
};
