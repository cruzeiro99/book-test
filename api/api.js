const path = require("path");
require("dotenv").config({path: path.resolve(".env")})
const express = require("express");
const database = require("./database/database");
const {ENV,PORT} = process.env;
const axios = require('axios')
const serverless = require("serverless-http");
// const base64 = require("js-base64")
// const {Base64} = require("js-base64")
const nodeB64 = require("node-base64-image")
const {Base64} = require("js-base64")
const domain = require("node:domain");

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
router.get("/characters", async (req, res) => {
	let data = await database.characters.find({})
	res.json(data);
})
router.get("/characters/:id", async (req, res) => {
	let id = parseInt(req.params.id);
	let data = await database.characters.find({id});
	if (data.length < 1)
		return res.status(404).json({message: "Not found"})
	res.json(data[0]);
})
router.get("/bookImage/:id", async (req, res) => {
	let id = parseInt(req.params.id);
	let books = await database.books.find({ id }, {select: ['image']})
	if (books.length < 1)
		return res.send(`Error getting image for ${id}`);
	let image = books[0].image.toString('base64');
	image = 'data:image/jpeg; base64,'+image;
	res.writeHead(200, {
		"Content-Type": 'text/plain',
		"Content-Length": image.length.toString()
	});
	res.end(image);
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

app.use((req, res, next) => {
	let d = domain.create();
	d.on('error', (err) => {
			if (err) {
				console.error(err);
				res.json({error: "Erro no servidor"});
			} else {
				next();
			}
	})
	d.run(() => next())
})
// app.use('/.netlify/functions/api', router);
app.use('/', router);

if (ENV === "development") {
	app.use('/', router);
	app.listen(PORT, () => console.log(`App running on port ${PORT}`))
}

module.exports = app;
module.exports.handler = serverless(app);