const { Schema, model } = require("mongoose");

module.exports = model("MSGLog", new Schema({
  Guild: String,
  del_logChannel: String,
  edit_logChannel: String
}));
