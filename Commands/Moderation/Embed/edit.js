const { SlashCommandBuilder, PermissionFlagsBits } = require("discord.js");
const { safeJSONParse, checkLength, checkEmbed, hexToDecimal, createEmbedObjects } = require("./say");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("edit")
    .setDescription("Edit an existing message")
    .setDMPermission(false)
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageMessages)
    .addChannelOption(options => options
      .setName("channel")
      .setDescription("Channel of the message to be edited")
      .setRequired(true))
    .addStringOption((options) => options
      .setName("message-id")
      .setDescription("ID of the message to be edited")
      .setRequired(true))
    .addStringOption((options) => options
      .setName("new-message")
      .setDescription("New message content (use https://eb.nadeko.bot/ for embed JSON data)")
      .setRequired(true))
    .addAttachmentOption((option) => option
      .setName('file')
      .setDescription('The file to upload')
      .setRequired(false)),

  async execute(interaction) {
    const { options } = interaction;
    const embedJSONString = options.getString("new-message");
    const channel = options.getChannel("channel") || interaction.channel;
    const messageId = options.getString("message-id");
    const attachment = options.getAttachment("file") || null;

    try {
      const messageToEdit = await channel.messages.fetch(messageId);
 
    if (attachment?.size > 25 * 1024 * 1024) {
      throw new Error("Attachment size cannot exceed 25 MB.");
    }

    let contentToSend = {
      files: attachment ? [{ attachment: attachment.url, name: attachment.name }] : []
    };

      const embedJSON = safeJSONParse(embedJSONString);

      if (embedJSON === null || typeof embedJSON === 'number') {
          checkLength(embedJSONString, 2000, `Message cannot exceed 2000 characters.`);
          await messageToEdit.edit({ ...contentToSend, content: embedJSONString });
          await interaction.reply({
              content: `Message edited in ${messageToEdit.url}\nYou can use https://eb.nadeko.bot/ to send embed messages.`,
              ephemeral: true
          });
          return;
      }

    checkLength(embedJSON.content, 2000, `Content cannot exceed 2000 characters.`);

     if (embedJSON.content && !embedJSON.embeds) {
        await messageToEdit.edit({ ...contentToSend, content: embedJSON.content });
        await interaction.reply({
          content: `Message edited in ${messageToEdit.url}\nYou can use https://eb.nadeko.bot/ to send embed messages.`,
          ephemeral: true
        });
        return;
      }
    
      checkLength(embedJSON.embeds, 10, `You cannot send more than 10 embeds in a single message.`);

      embedJSON.embeds?.forEach((embed, index) => {
          checkEmbed(embed, index);
      });

      const embedObjects = createEmbedObjects(embedJSON.embeds);

      await messageToEdit.edit({...contentToSend,
        content: embedJSON.content  || null,
        embeds: embedObjects,
      });

      await interaction.reply({
        content: `Message edited in ${messageToEdit.url}`,
        ephemeral: true
      });
    } catch (error) {
      console.error(error);
      await interaction.reply({
        content: `An error occurred:\n${error.message}`,
        ephemeral: true
      });
    }
  }
};
