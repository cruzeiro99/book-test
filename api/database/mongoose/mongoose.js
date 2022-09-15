const { envBased } = require("./../../helpers.js");
const { Book } = require("./books")
const { Character } = require("./characters")
const { House } = require("./houses")
const { DB_USER, DB_PASS } = process.env;
const mongoose = require("mongoose")

class ChainedQuery {
	constructor(parent) {
		this.parent = parent;
	}
	query(query) {
		this.chain.query = query;
		return this;
	}
	where(where) {
		this.chain.where = where;
		return this;
	}
}

class MongooseStrategy {
	model;
	models = {};
	constructor(model) {
		this.query = new ChainedQuery(this);
		this.models['books']      = Book;
		this.models['characters'] = Character;
		this.models['houses']     = House;
		this.changeModel("books");
		mongoose.connect(`mongodb+srv://${DB_USER}:${DB_PASS}@test.95mh8bs.mongodb.net/?retryWrites=true&w=majority`);
	}
	changeModel(name) {
		if (!this.models.hasOwnProperty(name))
			throw new Error(`No module named ${name} in NedbStrategy`);
		this.model = this.models[name];
		return this;
	}
	insertMany(data, options={}) {
		return new Promise((resolve, reject) => {
			if (!data) {
				// console.error("No data to insert on NeDB call");
				return reject({ message: "Invalid data" });
			}
			this.model.insertMany(data, (err) => {
				if (err) {
					console.error(err);
					return reject({message: "Internal error on insertMany occurred"});
				}
				resolve(true);
			});
		})
	}
	insert(data, options={}) {
		return new Promise((resolve, reject) => {
			if (!data) {
				// console.error("No data to insert on NeDB call");
				return reject({ message: "Invalid data" });
			}
			this.model.create(data, (err, newDocs) => {
				if (err) {
					console.error(err);
					return reject({message: "Internal error on insert occurred"});
				}
				resolve(newDocs);
			});
		})
	}
	find(query, options={}) {
		return new Promise((resolve, reject) => {
			const callback = (err,data) => {
				if (err) {
					console.error(err);
					return reject({message: "Internal error when trying to find"});
				}
				resolve(data)
			}
			let find = this.model.find(query);
			if (options.populate)
				options.populate.map(pop => find.populate(pop));
			if (options.exclude)
				options.exclude.map(ex => find.select(`-${ex}`));
			else if (options.select)
				options.select.map(s => find.select(s));
			find.exec(callback);
		})
	}
	truncate() {
		return new Promise((resolve, reject) => {
			this.model.deleteMany({}, (err) => {
				if (err) {
					console.error(err);
					return reject(false);
				}
				resolve(true)
			});
		})
	}
}

module.exports = { MongooseStrategy }