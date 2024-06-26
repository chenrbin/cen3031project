const mongoose = require('mongoose');
const mongoose_fuzzy_searching = require('mongoose-fuzzy-searching');
const Schema = mongoose.Schema
const clubSchema = new Schema({
    owner: {type: String, required: true},
    clubName: {type: String, required: true, unique: true},
    category: {type: String, required: true},
    url: {type: String, required: false},
    description: {type: String, required: false},
    memberCount: {type: Number, required: false},
    //icon: {type: Image, required: false}
});

clubSchema.plugin(mongoose_fuzzy_searching, {fields: ['clubName', "category", "description"]});
module.exports = mongoose.model("Club", clubSchema);