const { ContextMenuInteraction, ContextMenuCommandBuilder, ApplicationCommandType, EmbedBuilder } = require("discord.js");

module.exports = {
  data: new ContextMenuCommandBuilder()
    .setName("virus-total")
    .setType(ApplicationCommandType.Message),
  /**
   * 
   * @param {ContextMenuInteraction} interaction 
   */
  async execute(interaction) {
    try {
      await interaction.deferReply();

      const message = await interaction.channel.messages.fetch(interaction.targetId);

      // Check if the message has URLs
      const url = message.content.match(/(https?:\/\/[^\s]+)/g)?.[0];
      if (!url || url.length === 0)
        return await interaction.editReply({
          content: "<:akko:748932842670653480> This message doesn't contain any valid URL."
        });

      const scanRes = await fetch(`https://www.virustotal.com/api/v3/urls`, {
        method: "POST",
        headers: {
          accept: 'application/json',
          "x-apikey": process.env.virus_total,
          'content-type': 'application/x-www-form-urlencoded'
        },
        body: new URLSearchParams({ url: url })
      }).catch(err => console.error(err));

      const scanData = await scanRes.json();
      if (scanData.error) {
        return await interaction.editReply({
          content: `<:akko:748932842670653480> ${scanData.error.message}.`
        });
      }


      let analysisData = await fetchAnalysisData(scanData.data.id);

      // Check if analysis status is "queued", retry fetching until completed
      while (analysisData.data.attributes.status === 'queued') {
        await new Promise(resolve => setTimeout(resolve, 3000)); // Wait for a certain period (e.g., 5 seconds) before retrying
        analysisData = await fetchAnalysisData(scanData.data.id); // Retry fetching analysis data
      }

      const { malicious, suspicious, undetected, harmless, timeout } = analysisData.data.attributes.stats;
      const total = (malicious + suspicious + undetected + harmless).toString();

      const mal = malicious > 0 ? true : false;
      const sus = (malicious === 0 && suspicious > 0) ? true : false;

      const results = (mal || sus) ? "> <a:warning:827554337907277835> This URL appears suspicious. It may not be safe to visit!" : "> <:check:1191853535638335498> This URL is safe to visit. No security vendors flagged this URL as malicious.";
      const shortResult = mal ? "Malicious URL <a:warning:827554337907277835>" : sus ? "Suspicious URL <a:warning:827554337907277835>" : "Clean site <:check:1191853535638335498>";

      const embed = new EmbedBuilder()
        .setColor(mal ? "Red" : sus ? "Yellow" : "Green")
        .setTitle(`🛡️ VirusTotal Report for \`${url.length > 200 ? url.slice(0, 200) + '...' : url}\``)
        .setDescription(`${results}\r> [**View Full Report**](${analysisData.data.links.item.replace('api/v3/urls','gui/url')})\n## ${shortResult}`)
        .addFields(
          /*{
            name: '✅ Harmless',
            value: `‎ ‎ ‎ ‎ ‎ ‎ ‎ ‎ ‎ ${harmless.toString()}/${total}`,
            inline: true
          },*/ {
            name: '🚫 Malicious',
            value: `‎ ‎ ‎ ‎ ‎ ‎ ‎ ‎ ‎ ${malicious.toString()}/${total}`,
            inline: true
          }, {
            name: '⚠️ Suspicious',
            value: `‎ ‎ ‎ ‎ ‎ ‎ ‎ ‎ ‎ ‎ ${suspicious.toString()}/${total}`,
            inline: true
          }, {
            name: '❔ Undetected',
            value: `‎ ‎ ‎ ‎ ‎ ‎ ‎ ‎ ‎ ‎ ${(undetected + timeout).toString()}/${total}`,
            inline: true
          },
          //{ name: '📬 Timeout', value: timeout.toString(), inline: true }
          {
            "name": "​",
            "value": `​\n> Total Scanners: ${total}`,
            "inline": true
          }, {
            name: '📆 Scan Date',
            value: `<t:${analysisData.data.attributes.date}:f>`,
            inline: true
          }
        )
        .setThumbnail('https://i.ibb.co/k04tJ4f/image.png')
        .setFooter({
          text: "Note: The scan date doesn't reflect the time when you ran this command. It indicates the time when the VirusTotal API last checked the URL for viruses.",
          iconURL: 'https://i.ibb.co/0tPw78C/Malware.png'
        });

      await interaction.followUp({
        embeds: [embed]
      });

    } catch (error) {
      console.error(error);
      await interaction.followUp({
        content: "An error occurred while processing the request."
      });
    }
  }
};

// Define a function to fetch analysis data
async function fetchAnalysisData(scanId) {
  try {
    const analysisRes = await fetch(`https://www.virustotal.com/api/v3/analyses/${scanId}`, {
      method: 'GET',
      headers: {
        accept: 'application/json',
        'x-apikey': process.env.virus_total
      }
    });
    return analysisRes.json();
  } catch (err) {
    console.error(err);
  }
}