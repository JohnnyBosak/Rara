const { ApplicationCommandType } = require("discord.js");

async function loadCommands(client) {
  const { loadFiles } = require("../Functions/fileLoader");
  const ascii = require("ascii-table");
  const table = new ascii().setHeading("Commands", "Status");
  const contextMenuTable = new ascii().setHeading("ContextMenu", "Status");

  await client.commands.clear();
  await client.subCommands.clear();

  const commandsArray = await Promise.all(
    (await loadFiles("Commands")).map(async (file) => {
      const command = require(file);

      if (command.subCommand) {
        client.subCommands.set(command.subCommand, command);
      } else {
        // Ensure command.data contains valid command information
        if (!command.data || !command.data.name) {
          console.error(`Invalid command data in file '${file}'`);
          table.addRow("Unknown Command", "🔴");
          return null; // Skip this command
        }
        
        client.commands.set(command.data.name, command);
        if (command.data.type !== ApplicationCommandType.MESSAGE) {
          contextMenuTable.addRow(command.data.name, "🟢");
        } else {
          table.addRow(command.data.name, "🟢");
        }
        return command.data.toJSON();
      }
    })
  );

  client.application.commands.set(commandsArray.filter(Boolean));

  console.log(table.toString(), "\nRegular Commands Loaded.");
  console.log(contextMenuTable.toString(), "\nContextMenu Commands Loaded.");
}

module.exports = { loadCommands };