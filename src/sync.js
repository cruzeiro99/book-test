const path = require("path");
const { Base64 } = require("js-base64");
require("dotenv").config({ path: path.resolve(".env") })
const {LocalStorage} = require("node-localstorage");
const localStorage = new LocalStorage('./localStorage');
const database   = require("./database/database");
const axios      = require("axios");
const { Types: { ObjectId } } = require("mongoose");
const nodeB64 = require("node-base64-image")

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
	if (typeof url === "number")
		return url;
	if (typeof url !== "string")
		throw new Error(`${url} is not a string`);
	let id = url.split('/').pop();
	if (id === '')
		return '';
	id = parseInt(id);
	if (isNaN(id))
		throw new Error(`${id} is not a number`);
	return id;
}
const parseBook = async (book) => {
	let id = getId(book.url);
	let _id = new ObjectId();
	return {
		...book,
		id,
		_id,
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
		// console.log(`Getting ${storageKey} from cache`);
		return Promise.resolve(JSON.parse(b));
	}
	// console.log(`Fetching ${storageKey}`);
	return http.get(uri).then(result => {
		localStorage.setItem(storageKey, JSON.stringify(result.data));
		return result.data;
	})
}

function parseCharacter(character) {
	let id = getId(character.url);
	let _id = new ObjectId();
	return {
		...character,
		id,
		_id,
		titles: character.titles.filter(t => t !== ''),
		tvSeries: character.tvSeries.filter(t => t !== ''),
		playedBy: character.playedBy.filter(t => t !== ''),
		books: character.books.map(getId),
		povBooks: character.povBooks.map(getId),
		allegiances: character.allegiances.map(getId)
	}
}

function parseHouse(house) {
	let id = getId(house.url);
	let _id = new ObjectId();
	let currentLord = getId(house.currentLord);
	let heir = getId(house.heir);
	let overlord = getId(house.overlord);

	return {
		...house,
		currentLord,
		heir,
		overlord,
		titles: house.titles.filter(t => t !== ''),
		seats: house.seats.filter(t => t !== ''),
		ancestralWeapons: house.ancestralWeapons.filter(t => t !== ''),
		swornMembers: house.swornMembers.map(getId), 
		cadetBranches: house.cadetBranches.map(getId), 
		_id,
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
			// console.log("Looping", page);
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
			// console.log("Fetching books", page);
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
			// console.log("Fetching houses", page);
			let data = await getWithCache(houses, `/?pageSize=50&page=${page}`, `houses_${page}`);
			if (data.length < 1) {
				break;
			}
			let tmp = await Promise.all(data.map(parseHouse));
			_houses = _houses.concat(tmp);
			page++;
		}
		const imageURL = (isbn) => `https://covers.openlibrary.org/b/isbn/${isbn}-L.jpg`
		

		memory.books = _books;
		memory.books = await Promise.all(_books.map(parseBook))
		memory.characters = chars.map(parseCharacter);
		memory.houses = _houses.map(parseHouse);

		for (let book of memory.books) {
			let { isbn } = book;
			console.log(`Getting image for ${isbn} of ${book.name}`);
			// let image = await getWithCache(axios, imageURL(isbn), `image_${isbn}`);
			// let {data:image} = await axios.get(imageURL(isbn));
			book.image = await nodeB64.encode(imageURL(isbn), {string:true});
		}
		// memory.houses.map(c => {
		// 	if (c.ancestralWeapons.some(b => typeof b === "string"))
		// 		console.log('peguei',c);
		// })
		// return;
		const findById = (id) => (item) => item.id === id;
		const replaceBookCharacters = (characters) => (book) => {
			book.characters = book.characters.map(charId => {
				return characters.find(findById(charId))._id;
			})
			book.povCharacters = book.povCharacters.map(charId => {
				return characters.find(findById(charId))._id;
			});
			return book;
		}
		const replaceCharactersBook = (books) => (character) => {
			character.books = character.books.map(bookId => {
				return books.find(findById(bookId))._id;
			})
			character.povBooks = character.povBooks.map(bookId => {
				return books.find(findById(bookId))._id;
			})
			return character;
		}
		const replaceHouseIds = (houses, characters) => (house) => {
			house.cadetBranches = house.cadetBranches.map(houseId => {
				return houses.find(findById(houseId))._id;
			});
			house.swornMembers = house.swornMembers.map(charId => {
				return characters.find(findById(charId))._id;
			})
			return house;
		}
		memory.books = memory.books.map(replaceBookCharacters(memory.characters));
		memory.characters = memory.characters.map(replaceCharactersBook(memory.characters));
		memory.houses = memory.houses.map(replaceHouseIds(memory.houses, memory.characters));
		// console.log(memory.houses[6]);
		// return;
		// memory.characters.map(populateBooks(memory.characters))
		// memory.houses.map(populateBooks(memory.characters))

		database.books.truncate();
		database.characters.truncate();
		database.houses.truncate();

		console.log("Adding books...")
		await database.books.insertMany(memory.books);
		console.log("Adding characters...")
		await database.characters.insertMany(memory.characters);
		console.log("Adding houses...")
		await database.houses.insertMany(memory.houses);
		console.log("Finished")
	} catch (err) {
		console.error(err);
	}
}
main();