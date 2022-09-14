const path = require("path");
require("dotenv").config({path: path.resolve(".env")})
const express = require("express");
const database = require("./database/database");

const {ENV,PORT} = process.env;

const app = express();
const router = express.Router();


const findBook = (query) => {
	return database.books.find(query, {populate:['characters', 'povCharacters']})
} 
const error = (message) => {
	return {message};
}

router.get("/books", async (req, res) => {
	let data = await findBook();
	res.json(data);
})
router.get('/book/:id', async (req, res) => {
	let id = parseInt(req.params.id);
	if (isNaN(id))
		return res.json(error("Invalid id"));
	let data = await findBook({id});
	res.json(data);
})

app.use('.netlify/functions/api', router);
if (ENV === "development") {
	app.use('/', router);
	app.listen(PORT, () => console.log(`App running on port ${PORT}`))
}

module.exports = app;
module.exports.handler = router;