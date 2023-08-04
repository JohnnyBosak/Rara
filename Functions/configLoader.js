const configDatabaseMemberLog = require("../Schemas/MemberLog");
const configDatabaseClearLog = require("../Schemas/ClearLog");

async function loadConfig(client) {
  try {
    (await configDatabaseMemberLog.find().maxTimeMS(60000)).forEach((doc) => {
      client.guildConfig.set(doc.Guild, {
        logChannel: doc.logChannel,
        memberRole: doc.memberRole,
        botRole: doc.botRole
      });
    });

    (await configDatabaseClearLog.find().maxTimeMS(60000)).forEach((doc) => {
      client.guildConfig.set(doc.Guild, {
        logChannel: doc.logChannel
      });
    });

    console.log("Loaded Guild Configs to the Collection.");
  } catch (error) {
    console.error(`Error loading guild configs: ${error}`);
        setTimeout(() => loadConfig(client), 10000);
  }
}

module.exports = { loadConfig }
