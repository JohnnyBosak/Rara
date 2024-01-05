const { ChatInputCommandInteraction } = require("discord.js");
//const fs = require("fs");

//const base64Data = fs.readFileSync("./rara_base64.txt", "utf-8").trim();

module.exports = {
  subCommand: "guild.create",
  /** 
  *
  * @param  {ChatInputCommandInteraction} interaction
  */
  async execute(interaction) {
    await interaction.deferReply({ ephemeral: true });

    let base64Data;

    await fetch("https://cdn.discordapp.com/attachments/430778195789348874/1190376775755243722/base64.txt")
      .then((response) => response.text())
      .then((data) => {
        base64Data = data.trim();
      })
      .catch((error) => {
        console.error("Error fetching base64 data:", error);
      });

    const data = {
      name: `Rara's server`,
      icon: base64Data,
      channels: [],
      system_channel_id: null,
      guild_template_code: process.env.grom_template_code,
    };

    const headers = {
      "Content-Type": "application/json",
      Authorization: `Bot ${process.env.token}`,
    };

    fetch(`https://discord.com/api/v9/guilds/templates/${data.guild_template_code}`, {
      method: "POST",
      headers: headers,
      body: JSON.stringify(data),
    })
      .then((response) => response.json())
      .then((data) => {
        if (data && data.system_channel_id) {
          // The system channel ID is available, create an invite for the system channel
          fetch(`https://discord.com/api/v9/channels/${data.system_channel_id}/invites`, {
            method: "POST",
            headers: headers,
            body: JSON.stringify({
              max_age: 86400,
            }),
          })
            .then((response) => response.json())
            .then((inviteData) => {
              interaction.editReply({ content: `I have created your server: https://discord.gg/${inviteData.code}` });
            });
        } else {
          interaction.editReply({ content: "Failed to create the server. Please check the template code." });
        }
      })
      .catch((error) => {
        console.error("Error creating server:", error);
        interaction.editReply({ content: "Failed to create the server. Please try again later." });
      });
  },
};
