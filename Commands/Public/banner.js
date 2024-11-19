const { SlashCommandBuilder, ChatInputCommandInteraction, EmbedBuilder, AttachmentBuilder, PermissionFlagsBits } = require("discord.js");
const { profileImage } = require("discord-arts");

const colorChoices = require("../../colors.json");
const DEFAULT_BACKGROUND_IMAGE_URL = "https://i.imgur.com/DGA63O0.jpg";
const WHITE = "#FFFFFF";

module.exports = {
  data: new SlashCommandBuilder()
    .setName("banner")
    .setDescription("Display a stylish banner for a specified user")
    .setDMPermission(false)
    .setDefaultMemberPermissions(PermissionFlagsBits.SendMessages)
    .addUserOption((options) => options
      .setName("target")
      .setDescription("Select a user")
      .setRequired(true))
    .addStringOption(option =>
      option.setName("border-color")
        .setDescription("Choose the border color for the image.")
        .setRequired(true)
        .setAutocomplete(true)
        //.addChoices(...colorChoices.map(choice => ({ name: choice.name, value: choice.value })))
    )
    /*.addStringOption(option =>
      option.setName("background-image")
        .setDescription("URL of the custom background image")
        .setRequired(false))*/
    .addAttachmentOption(option =>
      option.setName('background-image')
        .setDescription("Upload a custom background image")
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
          { name: 'invisible', value: 'invisible' },)
    )  
    .addBooleanOption(option =>
      option.setName("disable-profile-theme")
        .setDescription("Disable the Discord profile theme colors")
        .setRequired(false)
    )
    .addBooleanOption(option =>
      option.setName("remove-avatar-frame")
        .setDescription("Remove the Discord avatar frame/decoration")
        .setRequired(false)
    ),

  /**
   * Autocomplete handler for color choices.
   * @param {ChatInputCommandInteraction} interaction.
   */
  async autocomplete(interaction) {
    const focusedOption = interaction.options.getFocused();
    const filtered = colorChoices.filter(choice => choice.name.toLowerCase().startsWith(focusedOption.toLowerCase()));
    await interaction.respond(
        filtered.map(choice => ({ name: choice.name, value: choice.value })).slice(0, 25)
    );
  },

  async execute(interaction) {
    await interaction.deferReply();

    try {
    const user = interaction.options.getUser("target");
    const borderColor = interaction.options.getString("border-color");
    const borderColor2 = interaction.options.getString("border-color2");
    const usernameColor = interaction.options.getString("username-color") || WHITE;
    const tagColor = interaction.options.getString("tag-color") || WHITE;
    const badgesFrame = interaction.options.getBoolean("badges-frame") || false;
    const customTagText = interaction.options.getString("tag-text") || (user.discriminator !== "0" ? user.discriminator : " ");
    //const backgroundImageUrl = interaction.options.getString("background-image") || DEFAULT_BACKGROUND_IMAGE_URL;
    const background = interaction.options.getAttachment("background-image")?.url || DEFAULT_BACKGROUND_IMAGE_URL;
    const presenceStatus = interaction.options.getString("presence-status") || "dnd";
    const squareAvatar = interaction.options.getBoolean("square-avatar") || false;
    const badgesInput = interaction.options.getString("badges");
    const disableProfileTheme = interaction.options.getString("disable-profile-theme");
    const removeAvatarFrame = interaction.options.getString("remove-avatar-frame");
    const badges = []; // Array to store the converted emote URLs

    // Check if the color is a valid hexadecimal color code.
    const HEX_REGEX = /^#([0-9a-fA-F]{3}){1,2}$/;
    if (!HEX_REGEX.test(borderColor) ||
      (borderColor2 && !HEX_REGEX.test(borderColor2)) ||
      (usernameColor && !HEX_REGEX.test(usernameColor)) ||
      (tagColor && !HEX_REGEX.test(tagColor))
    ) {
      return interaction.followUp({ content: "Invalid color. Please provide a valid hexadecimal color code, e.g., #FFFFFF." });
    }

    if (badgesInput) {
      const emotesAndUrls = badgesInput.split(" ");
      const emoteRegex = /^<a?:.+:\d+>$/; // Regular expression to match the emote format

      // Loop through each emote input or URL
      for (const emoteOrUrl of emotesAndUrls) {
        if (emoteRegex.test(emoteOrUrl)) { // Check if the input is in the emote format
          const emoteId = emoteOrUrl.match(/\d+/)[0]; // Extract the emote ID from the input
          const emoteUrl = `https://cdn.discordapp.com/emojis/${emoteId}.png`;
          badges.push(emoteUrl); // Add the emote URL to the array
        } else {
          badges.push(emoteOrUrl); // Treat the input as an image URL
        }
      }
    }
    
      // Generate the banner image using the provided options.
      const buffer = await profileImage(user.id, {
        customTag: customTagText,
        customBadges: badges.length > 0 ? badges : null,
        customBackground: background,
        //overwriteBadges: boolean,
        badgesFrame: badgesFrame,
        // removeBadges: boolean,
        // !!removeBorder?: boolean,
        usernameColor: usernameColor,
        tagColor: tagColor,
        borderColor: borderColor2 ? [borderColor, borderColor2] : borderColor,
        // !!borderAllign?: string,
        disableProfileTheme: disableProfileTheme || false, // Disable the discord profile theme colors !!!!
        presenceStatus: presenceStatus,
        squareAvatar: squareAvatar,
        removeAvatarFrame: removeAvatarFrame || false, // Remove the discord avatar frame/decoration (if any) !!!!!
        // rankData?: {
        //   currentXp: number, // Current user XP
        //   requiredXp: number, // XP required to level up
        //   level: number, // Current user level
        //   rank?: number, // Position on the leaderboard
        //   barColor?: string, // HEX XP bar color
        //   levelColor?: string, // HEX color of LVL text
        //   autoColorRank?: boolean, // Whether to color ranks as medal colors for 1st, 2nd, 3rd
        // }
        moreBackgroundBlur: false, // Triples blur of background image
        // backgroundBrightness?: number, // Set brightness of background from 1-100%
        // customDate?: Date || string, // Custom date or text to use instead of when user joined Discord
        // localDateType?: string, // Local format for the date, e.g. 'en' | 'es' etc.
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
      await interaction.editReply({ content: `Failed to generate banner image: ${error.message.replace("Discord Arts | ", "").replace(/ \(.*\)$/, "")}` });
    }
  },
};