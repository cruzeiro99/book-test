const path = require("path")
require("dotenv").config({path: path.resolve("src/.env.test")})
const database = require("./database");
const { expect, test, describe } = require("@jest/globals");

describe("Database tests", () => {
	test("should insert", () => {

		expect()
	})
})