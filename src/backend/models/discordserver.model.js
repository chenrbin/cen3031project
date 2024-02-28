const mongoose = require('mongoose');
const Schema = mongoose.Schema
const discordserverSchema = new Schema({
    serverName: {type: String, required: true},
    category: {type: String, required: true},
    url: {type: String, required: false},
    description: {type: String, required: false},
    memberCount: {type: Number, required: false},
    //icon: {type: Image, required: false}
});

const discordServer = mongoose.model("DiscordServer", discordserverSchema);
module.exports = discordServer;