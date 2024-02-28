const mongoose = require('mongoose');
const mongoose_fuzzy_searching = require('mongoose-fuzzy-searching');
const Schema = mongoose.Schema
const discordserverSchema = new Schema({
    serverName: {type: String, required: true},
    category: {type: String, required: true},
    url: {type: String, required: false},
    description: {type: String, required: false},
    memberCount: {type: Number, required: false},
    //icon: {type: Image, required: false}
});

discordserverSchema.plugin(mongoose_fuzzy_searching, {fields: ['serverName', "category", "description"]});
const discordServer = mongoose.model("DiscordServer", discordserverSchema);
module.exports = discordServer;