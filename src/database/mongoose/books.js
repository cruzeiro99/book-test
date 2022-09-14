const { Types: { ObjectId }, Schema, model } = require("mongoose");

const BooksSchema = new Schema({
	_id: false,
	id: { type: Number, required: true, unique: true, index:true, alias: '_id' },
	name: { type: String, default: "A Game of Thrones" },
	isbn: { type: String, default: "978-0553103540" },
	authors: [ { type: String } ],
	numberOfPages: { type: Number },
	publisher: { type: String, default: "Bantam Books" },
	country: { type: String, default: "United States" },
	mediaType: { type: String, default: "Hardcover" },
	released: { type: String, default: "1996-08-01T00:00:00" },
	characters: [ { type: Number, ref: "Character" } ],
	povCharacters: [ { type: Number, ref: "Character" } ],
})

const Book = model("Book", BooksSchema);

module.exports = { BooksSchema, Book };