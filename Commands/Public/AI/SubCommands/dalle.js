const { ChatInputCommandInteraction } = require("discord.js");
const { RsnChat } = require("rsnchat");

const rsnchat = new RsnChat(process.env.rsnai);

module.exports = {
  subCommand: "ai.dalle",

  /** 
   *
   * @param {ChatInputCommandInteraction} interaction
   */
  async execute(interaction) {
    try {
      await interaction.deferReply();

      const prompt = interaction.options.getString('prompt');

      const responseDalle = await rsnchat.dalle(prompt);
        console.log(responseDalle);
      const response = responseDalle.imageUrl;

      if (response !== null) {
        console.log(response);
        await interaction.editReply({
          files: [{ attachment: response }],
        });
      } else {
        console.log(response);
        await interaction.editReply("Unable to generate a response.");
      }
        
    } catch (error) {
      console.error(error);
      await interaction.editReply("An error occurred while processing the request. Please try again later.");
    }
  },
};