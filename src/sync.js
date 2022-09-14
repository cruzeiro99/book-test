const path = require("path");
require("dotenv").config({ path: path.resolve(".env") })
const {LocalStorage} = require("node-localstorage");
const localStorage = new LocalStorage('./localStorage');
const database   = require("./database/database");
const axios      = require("axios");
const books      = axios.create({ baseURL: 'https://anapioficeandfire.com/api/books/' })
const characters = axios.create({baseURL: 'https://anapioficeandfire.com/api/characters/'});
const houses = axios.create({baseURL: 'https://anapioficeandfire.com/api/houses/'});
const character  = (id) => characters.get(`/${id}`)
const book       = (id) => books.get(`/${id}`)

const memory = {
	characters: [],
	books: []
}
/*
	1) Save all boooks
	2) Obtain artist info
	3) Get the photo of all books (base64)
*/
const getId = (url) => {
	if (typeof url !== "string")
		throw new Error(`${url} is not a string`);
	let id = url.split('/').pop();
	console.log({id,url});
	id = parseInt(id);
	if (isNaN(id))
		throw new Error(`${id} is not a number`);
	return id;
}
const parseBook = async (book) => {
	let id = getId(book.url);
	return {
		...book,
		id,
		characters: book.characters.map(getId),
		povCharacters: book.povCharacters.map(getId)
	}
}
// const fetchCharacters = async (id) => {
// 	return getWithCache(characters, `/${id}`, `characters_${id}`);
// }
let limit = 10;
const getWithCache = (http, uri, storageKey) => {
	let b = localStorage.getItem(storageKey);
	if (b) {
		console.log(`Getting ${storageKey} from cache`);
		return Promise.resolve(JSON.parse(b));
	}
	console.log(`Fetching ${storageKey}`);
	return http.get(uri).then(result => {
		localStorage.setItem(storageKey, JSON.stringify(result.data));
		return result.data;
	})
}

function parseCharacter(character) {
	let id = getId(character.url);
	return {
		...character,
		id,
		books: character.books.map(getId),
		allegiances: character.allegiances.map(getId)
	}
}

function parseHouse(house) {
	let id = getId(house.url);
	let currentLord = getId(house.currentLord);
	let heir = getId(house.heir);
	let overlord = getId(house.overlord);

	return {
		...house,
		currentLord,
		heir,
		overlord,
		swornMembers: house.swornMembers.map(getId), 
		cadetBranches: house.cadetBranches.map(getId), 
		id,
	}
}

async function main() {
	try {
		// let _books = await getWithCache(books, '/', 'books');
		// _books = await Promise.all(_books.map(parseBook))

		// let _charac = await getWithCache(characters, '/', 'characters');
		// let charactersToFetch = _books.map(b => {
		// 	return b.characters.concat(b.povCharacters);
		// }).flat();
		// console.log(charactersToFetch);

		// return;
		let chars = [];
		let page = 1;
		while (true) {
			console.log("Looping", page);
			let data = await getWithCache(characters, `/?pageSize=50&page=${page}`, `characters_${page}`);
			if (data.length < 1) {
				break;
			}
			chars = chars.concat(data);
			page++;
		};

		_books = [];
		page = 1;
		while (true) {
			console.log("Fetching books", page);
			let data = await getWithCache(books, `/?pageSize=50&page=${page}`, `books_${page}`);
			if (data.length < 1) {
				break;
			}
			let tmp = await Promise.all(data.map(parseBook));
			_books = _books.concat(tmp);
			page++;
		}
		let _houses = [];
		page = 1;
		while (true) {
			console.log("Fetching houses", page);
			let data = await getWithCache(houses, `/?pageSize=50&page=${page}`, `houses_${page}`);
			if (data.length < 1) {
				break;
			}
			let tmp = await Promise.all(data.map(parseHouse));
			_houses = _houses.concat(tmp);
			page++;
		}
		memory.books = _books;
		memory.books = await Promise.all(_books.map(parseBook))
		memory.characters = chars.map(parseCharacter);
		memory.houses = _houses.map(parseHouse);
		// memory.books.map(book => {
		// 	database.books.insert(book);
		// })
		// console.log( memory.books[0] )


		// console.log(memory.houses);
		// console.log("inserting books");
		// await database.books.insert(memory.books);
		// console.log("books inserted");
	} catch (err) {
		console.error(err);
	}
}
main();