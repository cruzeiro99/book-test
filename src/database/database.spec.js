const path = require("path");
require("dotenv").config({ path: path.resolve(".env.test") })
const database       = require("./database");
const {LocalStorage} = require("node-localstorage");
const localStorage   = new LocalStorage(path.resolve("localStorage"));
const { expect, test, describe, beforeAll } = require("@jest/globals");
const { ENV }        = process.env;

const book_1  = JSON.parse(localStorage.getItem("books_1"))
const chara_1 = JSON.parse(localStorage.getItem("characters_1"))

beforeAll(() => {
	database.books.truncate().then((r) => {
		expect(r).toBe(true);
	});
})

describe("Database tests", () => {
	test("should insert", () => {
		expect(database.books.insert(book_1)).resolves.toMatchObject({name: book_1.name});
	})
	test("should not insert empty data", () => {
		expect(database.books.insert()).rejects.toHaveProperty('message');
	})
	test("should get the book", () => {
		expect(database.books.find(book_1)).resolves.toEqual(
			expect.arrayContaining([
				expect.objectContaining({name: book_1.name})
			])
		);
	})
})