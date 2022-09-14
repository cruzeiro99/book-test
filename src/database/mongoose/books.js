const { Types: { ObjectId }, Schema, model } = require("mongoose");

const BooksSchema = new Schema({
	id: { type: Number, required: true, unique: true, index:true },
	name: { type: String, default: "A Game of Thrones" },
	isbn: { type: String, default: "" },
	image: { type: String, default: "" },
	authors: [ { type: String } ],
	numberOfPages: { type: Number },
	publisher: { type: String, default: "Bantam Books" },
	country: { type: String, default: "United States" },
	mediaType: { type: String, default: "Hardcover" },
	released: { type: String, default: "1996-08-01T00:00:00" },
	characters: { type: [ObjectId], ref: "Character" },
	povCharacters: { type: [ObjectId], ref: "Character" },
}, {toObject: {virtuals: true}, toJSON: {virtuals: true}})

// BooksSchema.virtual("_characters", {
// 	ref: "Character",
// 	localField: 'characters',
// 	foreignField: 'id'
// })

const Book = model("Book", BooksSchema);

module.exports = { BooksSchema, Book };