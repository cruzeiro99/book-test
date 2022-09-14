const { Types: { ObjectId }, Schema, model } = require("mongoose");

const CharacterSchema = new Schema({
	_id: false,
	id: { type: Number, unique: true, required: true, index:true, alias: '_id' },
	name: { type: String, default: "Arya Stark"},
	gender: { type: String, default: "Female"},
	culture: { type: String, default: "Northmen"},
	born: { type: String, default: "In 289 AC, at Winterfell"},
	died: { type: String, default: ""},
	titles: { type: [ String ] },
	aliases: { type: [ String ] },
	father: { type: String, default: ""},
	mother: { type: String, default: ""},
	spouse: { type: String, default: ""},
	allegiances: [ { type: String } ],
	books: [ { type: Number, ref: 'Book' } ],
	povBooks: [ { type: Number, ref: "Book" } ],
	tvSeries: [ { type: String } ],
	playedBy: [ { type: String } ],
});

const Character = model('Character', CharacterSchema);

module.exports = { CharacterSchema, Character };