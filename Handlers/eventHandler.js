const { loadFiles } = require("../Functions/fileLoader");

async function loadEvents(client) {
  console.time("Events Loaded");

  client.events.clear();
  
  client.events = new Map();
  const events = new Array();

  const files = await loadFiles("Events");

  await Promise.all(
    files.map(async (file) => {
      try {
        const event = require(file);
        const execute = (...args) => event.execute(...args, client);
        const target = event.rest ? client.rest : client;

        target[event.once ? "once" : "on"](event.name, execute);
        client.events.set(event.name, execute);

        events.push({ Event: event.name, Status: "🟢" });
      } catch (error) {
        console.error(`Error loading event '${file}':`, error);
        events.push({ Event: file.split("/").pop().slice(0, -3), Status: "🔴" });
      }
    })
  );

  console.table(events, ["Event", "Status"]);
  console.info("\n\x1b[36m%s\x1b[0m", "Loaded Events.");
  console.timeEnd("Events Loaded");
}

module.exports = { loadEvents };
