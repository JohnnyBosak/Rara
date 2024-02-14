const { Schema, model } = require("mongoose");

module.exports = model("ClearLog", new Schema({
  Guild: String,
  logChannel: String
}));
