const { Types: { ObjectId }, Schema, model } = require("mongoose");

const HouseSchema = new Schema({
	_id: false,
	id: { type: Number, unique: true, required: true, index: true, alias: '_id' },
	name: { type: String },
	region: { type: String },
	coatOfArms: { type: String },
	words: { type: String },
	titles: { type: [ String ] },
	seats: { type: [ String ] },
	currentLord: { type: String },
	heir: { type: String },
	overlord: { type: String },
	founded: { type: String },
	founder: { type: String },
	diedOut: { type: String },
	ancestralWeapons: { type: [ Number ], ref: 'Book' },
	cadetBranches: { type: [ Number ], ref: "Book" },
	swornMembers: { type: [ Number ], ref: 'Character' },
});

const House = model('House', HouseSchema);

module.exports = { HouseSchema, House };