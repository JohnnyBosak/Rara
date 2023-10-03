const { model, Schema } = require('mongoose');

module.exports = model("BoosterLog", new Schema({
  Guild : String,
  AnnouncementChannel : String,
  logChannel : String
}))
