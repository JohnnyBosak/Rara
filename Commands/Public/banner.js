const { SlashCommandBuilder, ChatInputCommandInteraction, AttachmentBuilder, Client, PermissionsBitField } = require("discord.js");
const { profileImage } = require("discord-arts");

module.exports = {
    data: new SlashCommandBuilder()
    .setName("banana")
    .setDescription("Creates A Banner With For User")
    .setDMPermission(false)
    .addUserOption((options) => options
        .setName("user")
        .setDescription("Provide the Target User")
        .setRequired(true))
/*	.addStringOption(option =>
		option.setName("tag")
			.setDescription("Type the tag to display under the user image")
            .setRequired(true))
	.addAttachmentOption(option =>
		option.setName("badges")
			.setDescription("The badges that you want to display")
            .setRequired(true))*/
	.addStringOption(option =>
		option.setName("background")
			.setDescription("The custom background that you want to display")
            .setRequired(true))
	.addStringOption(option =>
		option.setName("username-color")
			.setDescription("Color of your username.")
            .setRequired(true))
	.addStringOption(option =>
		option.setName("tag-color")
			.setDescription("Color of your tag.")
            .setRequired(true)) 
	.addStringOption(option =>
		option.setName("border-color")
			.setDescription("Color of your image border.")
            .setRequired(true)),    
    /**
     * @param {ChatInputCommandInteraction} interaction
     * @param {Client} client 
     */
    async execute(interaction, client) {
        const { options } = interaction;
        
        interaction.deferReply();
        
        const user = options.getUser("user");
        const tag = options.getString("tag");
        const badges = options.getAttachment("badges");
        const background = options.getString("background");
        const usernamecolor = options.getString("username-color");
        const tagcolor = options.getString("tag-color");
        const bordercolor = options.getString("border-color");

        const buffer = await profileImage(user.id, {
            usernameColor: usernamecolor,
            tagColor: tagcolor,
            borderColor: bordercolor,
            customTag: user.tag,
            //customBadges: badges,
            customBackground: background,
            overwriteBadges: false,
            borderColor: bordercolor,
            badgesFrame: true,
        });
        
        const attachment = new AttachmentBuilder(buffer, { name: 'banner.png' });
        await interaction.followUp({files: [attachment]})

    }

}