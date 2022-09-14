const path = require("path");
require("dotenv").config({path: path.resolve(".env")})
const express = require("express");
const database = require("./database/database");
const {Base64} = require("js-base64")
const {ENV,PORT} = process.env;
const axios = require('axios')
const serverless = require("serverless-http");

const app = express();
const router = express.Router();


const findBook = (query) => {
	return database.books.find(query, {
		populate:['characters', 'povCharacters'],
		exclude: ['image', 'characters']
	})
} 
const error = (message) => {
	return {message};
}
let cache = {
	books: undefined
}
const imageURL = (isbn) => `https://covers.openlibrary.org/b/isbn/${isbn}-L.jpg`

router.get("/bookImage/:id", async (req, res) => {
	let id = parseInt(req.params.id);
	let books = await database.books.find({ id }, {select: ['image']})
	if (books.length < 1)
		return res.send(`Error getting image for ${id}`);
	res.setHeader("Content-Type", "image/jpg; charset=utf-8");
	let image = Buffer.from(books[0].image, 'base64');
	res.end(image);
	// res.send(`${books[0].image}`);
})
router.get("/books", async (req, res) => {
	res.setHeader("Cache-Control", "private");
	let data;
	if (cache.books)
		data = cache.books;
	else
		data = await findBook();
	res.json(data);
})
router.get('/book/:id', async (req, res) => {
	let id = parseInt(req.params.id);
	if (isNaN(id))
		return res.json(error("Invalid id"));
	let data = await findBook({id});
	res.json(data);
})
router.use((req, res, next) => {
	if (ENV === "development") {
		res.setHeader("Access-Control-Allow-Origin", "*");
		res.setHeader("Access-Control-Allow-Headers", "*");
	}
	next();
})

app.use('/.netlify/functions/api', router);

if (ENV === "development") {
	app.use('/', router);
	app.listen(PORT, () => console.log(`App running on port ${PORT}`))
}

module.exports = app;
module.exports.handler = serverless(app);