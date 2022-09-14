const path = require("path");
require("dotenv").config({path: path.resolve(".env")})
const express = require("express");
const database = require("./database/database");
const {Base64} = require("js-base64")
const {ENV,PORT} = process.env;
const axios = require('axios')
const serverless = require("serverless-http");
const base64 = require("js-base64")

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

router.use((req, res, next) => {
	res.setHeader("Access-Control-Allow-Origin", "*");
	res.setHeader("Access-Control-Allow-Headers", "*");
	next();
})
router.get("/bookImage/:id", async (req, res) => {
	let id = parseInt(req.params.id);
	let books = await database.books.find({ id }, {select: ['image']})
	if (books.length < 1)
		return res.send(`Error getting image for ${id}`);
	let image = Buffer.from(books[0].image, 'base64');
	// let image = "data:image/jpg;base64,"+books[0].image;
	res.setHeader("Content-Type", "image/jpg");
	res.setHeader("Content-Length", image.length.toString());
	res.end(image);
	// res.send(image);
})
router.get("/books", async (req, res) => {
	console.time("FETCHING BOOKS")
	let data;
	if (cache.books)
		data = cache.books;
	else
		data = await findBook();
	console.timeEnd("FETCHING BOOKS");
	res.json(data);
})
router.get('/book/:id', async (req, res) => {
	let id = parseInt(req.params.id);
	if (isNaN(id))
		return res.json(error("Invalid id"));
	let data = await findBook({id});
	res.json(data);
})

app.use('/.netlify/functions/api', router);

if (ENV === "development") {
	app.use('/', router);
	app.listen(PORT, () => console.log(`App running on port ${PORT}`))
}

module.exports = app;
module.exports.handler = serverless(app);