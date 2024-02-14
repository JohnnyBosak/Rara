const { Schema, model } = require("mongoose");

module.exports = model("BanLog", new Schema({
  Guild: String,
  logChannel: String
}));
