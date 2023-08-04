async function loadCommands(client) {
  const { loadFiles } = require("../Functions/fileLoader");
  const ascii = require("ascii-table");
  const table = new ascii().setHeading("Commands", "Status");

  await client.commands.clear();
  await client.subCommands.clear();

  const commandsArray = await Promise.all(
    (await loadFiles("Commands")).map(async (file) => {
      const command = require(file);

      if (command.subCommand) {
        client.subCommands.set(command.subCommand, command);
      } else {
        client.commands.set(command.data.name, command);
        table.addRow(command.data.name, "🟢");
        return command.data.toJSON();
      }
    })
  );

  client.application.commands.set(commandsArray.filter(Boolean));

  console.log(table.toString(), "\nCommands Loaded.");
}

module.exports = { loadCommands };
