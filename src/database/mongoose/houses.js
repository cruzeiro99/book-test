const { Types: { ObjectId }, Schema, model } = require("mongoose");

const HouseSchema = new Schema({
	id: { type: Number, unique: true, required: true, index: true },
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
	ancestralWeapons: { type: [ String ] },
	cadetBranches: { type: [ ObjectId ], ref: "Book" },
	swornMembers: { type: [ ObjectId ], ref: 'Character' },
});

const House = model('House', HouseSchema);

module.exports = { HouseSchema, House };