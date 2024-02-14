const { Schema, model } = require("mongoose");

module.exports = model("Suggestion", new Schema({
    GuildID: String,
    AuthorID: String,
    Msg: String,
    Upmembers: Array,
    Downmembers: Array,
    upvotes: Number,
    downvotes: Number
}));
