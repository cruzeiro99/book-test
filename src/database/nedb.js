const path = require("path")
const Datastore = require("nedb");
const {envBased} = require("./../helpers.js")

class NedbStrategy {
	model;
	models = {};
	constructor(model) {
		const booksFile = envBased('books', 'books.dev', 'books.test')
		let books = new Datastore({filename: path.join(__dirname, "data", booksFile), autoload: true});
		this.models['books'] = books;
		this.changeModel("books");	
	}
	changeModel(name) {
		if (!this.models.hasOwnProperty(name))
			throw new Error(`No module named ${name} in NedbStrategy`);
		this.model = this.models[name];
		return this;
	}
	insert(data, options={}) {
		return new Promise((resolve,reject) => {
			if (!data) {
				// console.error("No data to insert on NeDB call");
				return reject({message: "Invalid data"});
			}
			this.model.insert(data, (err, newDocs) => {
				if (err) {
					console.error(err);
					return reject({message: "Internal error occurred"});
				}
				resolve(newDocs);
			});
		})
	}
	find(query, options={}) {
		return new Promise((resolve, reject) => {
			if (!query) {
				return reject({message: "Invalid find query"});
			}
			this.model.find(query, options, (err,data) => {
				if (err) {
					console.error(err);
					return reject({message: "Internal error when trying to find"});
				}
				resolve(data)
			})
		})
	}
	truncate() {
		return new Promise((resolve, reject) => {
			this.model.remove({}, {multi: true}, (err) => {
				if (err) {
					console.error(err);
					return reject(false);
				}
				resolve(true)
			});
		})
	}
}

module.exports = { NedbStrategy }