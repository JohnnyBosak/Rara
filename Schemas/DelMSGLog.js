const { Schema, model } = require("mongoose");

module.exports = model("DelMSGLog", new Schema({
  Guild: String,
  logChannel: String
}))
