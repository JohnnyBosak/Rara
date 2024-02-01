const { SlashCommandBuilder, ChatInputCommandInteraction, EmbedBuilder, AttachmentBuilder, PermissionFlagsBits } = require("discord.js");
const { profileImage } = require("discord-arts");

const colorChoices = require("../../colors.json");
const DEFAULT_BACKGROUND_IMAGE_URL = "https://i.imgur.com/DGA63O0.jpg";
const WHITE = "#FFFFFF";

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
        .setRequired(true)
        .setAutocomplete(true)
        //.addChoices(...colorChoices.map(choice => ({ name: choice.name, value: choice.value })))
    )
    .addStringOption(option =>
      option.setName("background-image")
        .setDescription("URL of the custom background image")
        .setRequired(false))
    .addStringOption(option =>
      option.setName("username-color")
        .setDescription("Color of your username.")
        .setRequired(false)
        .setAutocomplete(true)
        //.addChoices(...colorChoices.map(choice => ({ name: choice.name, value: choice.value })))
    )
    .addStringOption(option =>
      option.setName("tag-text")
        .setDescription("Text to display on the custom tag")
        .setRequired(false))
    .addStringOption(option =>
      option.setName("tag-color")
        .setDescription("Color of your tag.")
        .setRequired(false)
        .setAutocomplete(true)
        //.addChoices(...colorChoices.map(choice => ({ name: choice.name, value: choice.value })))
    )
    .addStringOption(option =>
      option.setName("badges")
        .setDescription("The badges that you want to display")
        .setRequired(false))
    .addBooleanOption(option =>
      option.setName("badges-frame")
        .setDescription("Creates a small frame behind the badges.")
        .setRequired(false))
    .addStringOption(option =>
      option.setName("border-color2")
        .setDescription("Second color of your image border.")
        .setRequired(false)
        .setAutocomplete(true)
        //.addChoices(...colorChoices.map(choice => ({ name: choice.name, value: choice.value })))
    )
    .addBooleanOption(option =>
      option.setName("square-avatar")
        .setDescription("Change avatar shape to a square")
        .setRequired(false))
    .addStringOption(option =>
      option.setName("presence-status")
        .setDescription("Presence status to use for the user")
        .setRequired(false)
        .addChoices(
          { name: 'online', value: 'online' },
          { name: 'idle', value: 'idle' },
          { name: 'dnd', value: 'dnd' },
          { name: 'invisible', value: 'invisible' },
        )
    ),

  /**
   * Executes the banner command and generates a banner image for the specified user with the provided options.
   * @param {ChatInputCommandInteraction} interaction The interaction object representing the slash command invocation.
   */
  async autocomplete(interaction) {
    const focusedOption = interaction.options.getFocused();

    const filtered = colorChoices.filter(choice => choice.name.toLowerCase().startsWith(focusedOption.toLowerCase()));
    await interaction.respond(
        (filtered.map(choice => ({ name: choice.name, value: choice.value }))).slice(0, 25)
    );
  },

  async execute(interaction) {
    await interaction.deferReply();

    const user = interaction.options.getUser("target");

    const borderColor = interaction.options.getString("border-color");
    const borderColor2 = interaction.options.getString("border-color2");
    const usernamecolor = interaction.options.getString("username-color") || WHITE;
    const tagcolor = interaction.options.getString("tag-color") || WHITE;
    // Check if the color is a valid hexadecimal color code.
    const hexRegex = /^#([0-9a-fA-F]{3}){1,2}$/;
    if (
      (!hexRegex.test(borderColor)) ||
      (borderColor2 && !hexRegex.test(borderColor2)) ||
      (usernamecolor && !hexRegex.test(usernamecolor)) ||
      (tagcolor && !hexRegex.test(tagcolor))
    ) {
      return interaction.followUp({ content: "Invalid color. Please provide a valid hexadecimal color code, e.g. #FFFFFF." });
    }

    const badgesFrame = interaction.options.getBoolean("badges-frame") || false;
    const customTagText = interaction.options.getString("tag-text") || (user.discriminator !== "0" ? user.discriminator : " ");
    const backgroundImageUrl = interaction.options.getString("background-image") || DEFAULT_BACKGROUND_IMAGE_URL;
    const presenceStatus = interaction.options.getString("presence-status") || "dnd";
    const squareAvatar = interaction.options.getBoolean("square-avatar") || false;
    const badgesInput = interaction.options.getString("badges");
    let badges = []; // Array to store the converted emote URLs

    if (badgesInput) {
      const emotesAndUrls = badgesInput.split(" ");

      // Regular expression to match the emote format
      const emoteRegex = /^<a?:.+:\d+>$/;

      // Loop through each emote input or URL
      for (const emoteOrUrl of emotesAndUrls) {
        // Check if the input is in the emote format
        if (emoteRegex.test(emoteOrUrl)) {
          // Extract the emote ID from the input
          const emoteId = emoteOrUrl.match(/\d+/)[0];

          // Construct the URL for the emote image
          const emoteUrl = `https://cdn.discordapp.com/emojis/${emoteId}.png`;

          // Add the emote URL to the array
          badges.push(emoteUrl);
        } else {
          // Treat the input as an image URL
          badges.push(emoteOrUrl);
        }
      }
    }

    try {
      // Generate the banner image using the provided options.
      const buffer = await profileImage(user.id, {
        customTag: customTagText,
        customBadges: badges.length > 0 ? badges : null,
        customBackground: backgroundImageUrl,
        //overwriteBadges: boolean,
        badgesFrame: badgesFrame,
        // !!removeBadges?: boolean,
        // !!removeBorder?: boolean,
        usernameColor: usernamecolor,
        tagColor: tagcolor,
        borderColor: borderColor2 ? [borderColor, borderColor2] : borderColor,
        // !!borderAllign?: string,
        presenceStatus: presenceStatus,
        squareAvatar: squareAvatar,
        // rankData?: {
        //   currentXp: number, // Current user XP
        //   requiredXp: number, // XP required to level up
        //   level: number, // Current user level
        //   rank?: number, // Position on the leaderboard
        //   barColor?: string, // HEX XP bar color
        // }
      });

      const attachment = new AttachmentBuilder(buffer, { name: "profile.png" });

      // Send the generated banner image as an attachment to the user.
      await interaction.editReply({
        embeds: [
          new EmbedBuilder()
            .setColor(borderColor)
            .setImage("attachment://profile.png"),
        ],
        files: [attachment],
      });
    } catch (error) {
      console.error(error);
      await interaction.editReply({ content: "Failed to generate banner image." });
    }
  },
};
