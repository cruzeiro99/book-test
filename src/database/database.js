const { NedbStrategy } = require("./nedb");
const { MongooseStrategy } = require("./mongoose/mongoose");

class Database {
	constructor(strategy) {
		this.strategy = strategy;
	}
	changeStrategy(strategy) {
		this.strategy = strategy;
	}
	async insertMany(data, options) {
		return this.strategy.insertMany(data, options);
	}
	async insert(data, options) {
		return this.strategy.insert(data, options);
	}
	async find(query, options) {
		return this.strategy.find(query, options);
	}
	async truncate() {
		return this.strategy.truncate();
	}
	get houses() {
		this.strategy.changeModel("houses");
		return this;
	}
	get books() {
		this.strategy.changeModel("books");
		return this;
	}
	get characters() {
		this.strategy.changeModel('characters');
		return this;
	}
}
module.exports = new Database(new MongooseStrategy);