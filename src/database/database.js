
class Database {
	constructor(strategy) {
		this.strategy = strategy;
	}
	changeStrategy(strategy) {
		this.strategy = strategy;
	}
	async insert(data, options) {
		return await this.strategy.insert(data, options);
	}
	books() {
		this.strategy.changeModel("books");
		return this;
	}
}

class NedbStrategy {
	model;
	models = {};
	constructor(model) {
		let books = new Datastore({filename: path.join(__dirname, "data", "books"), autoload: true});
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
				console.error("No data to insert on NeDB call");
				reject({message: "Invalid data"});
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
}

class MongooseStrategy {
	async insert(data, options) {

	}
}


module.exports = new Database(new NedbStrategy);