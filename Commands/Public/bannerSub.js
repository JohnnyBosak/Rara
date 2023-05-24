const { SlashCommandBuilder, ChatInputCommandInteraction, EmbedBuilder, AttachmentBuilder, PermissionFlagsBits } = require("discord.js");
const { profileImage } = require("discord-arts");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("banner")
    .setDescription("See a hot banner of a specific user")
    .setDMPermission(false)
    .setDefaultMemberPermissions(PermissionFlagsBits.SendMessages)
    .addUserOption((options) => options
        .setDescription("Provide a user target")
        .setName("target")
        .setRequired(true))
    .addStringOption(option =>
		option.setName("border-color")
    .setDescription("Color of your image border.")
    .setRequired(true)),

    /**
     * @param {ChatInputCommandInteraction} interaction 
     */
  async execute(interaction) {
    await interaction.deferReply();

    const user = interaction.options.getUser("target");
    const borderColor = interaction.options.getString("border-color");

  // Regular expression to check if the input is a valid hexadecimal color code
  const hexRegex = /^#([0-9a-fA-F]{3}){1,2}$/;

  if (!hexRegex.test(borderColor)) {
    // Return an error message if the input is not a valid hexadecimal color code
    return interaction.followUp({ content: "Invalid border color. Please provide a valid hexadecimal color code, e.g. #FFFFFF." });
  }

    const buffer = await profileImage(user.id, {
      customTag: "Programmer",
      /*customBadges: [  'https://cdn.discordapp.com/attachments/814865205842542622/853664829508157490/MikuDab.png', 'https://cdn.discordapp.com/attachments/814865205842542622/853649827829383178/angry.png'  ], */
      customBackground: "https://i.imgur.com/DGA63O0.jpg",
      overwriteBadges: false,
      borderColor: borderColor,
      presenceStatus: "dnd",
    });
    const attachment = new AttachmentBuilder(buffer, { name: "profile.png" });

interaction.editReply({
        content: `${interaction.user} your requested banner has been created`,
        embeds: [
          new EmbedBuilder()
            .setColor(borderColor)
            .setImage("attachment://profile.png"),
        ],
        files: [attachment],
      });
    //interaction.editReply({ files: [attachment] });
  }
}