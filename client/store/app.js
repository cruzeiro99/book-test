import {makeAutoObservable, runInAction} from "mobx"
import api from "./../api/api"

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

const timer = (time) => new Promise(resolve => {
	setTimeout(resolve, time);
})

export class App {
	_books = [];
	books = [];
	_currentBook;
	fetchingBooks = true;

	constructor() {
		makeAutoObservable(this);
		this.fetchBooks();
	}
	changeBook(book) {
		this._currentBook = book;
	}
	get book() {
		return this._currentBook;
	}
	get books() {
		return this.books;
	}
	handleBookClick = (book) => (event) => {
		console.log(event.currentTarget.value)
		this.changeBook(book);
	}
	handleSearch = (event) => {
		let val = event.currentTarget.value;
		if (!val)
			return this.books.replace(this._books);
		let reg = new RegExp(`${val}`, 'ig');
		this.books.replace([]);
		this._books.map(async (b) => {
			if ( reg.test(b.name) ) {
				await timer(150);
				runInAction(() => {
					if (this.books.some(book => book._id === b._id))
						return;
					this.books.push(b);
				})
			}
		})
	}
	async fetchBooks(setDefault=true) {
		this.fetchingBooks = true;
		let {data} = await api.get("/books")
			.catch((err) => {console.error; return {};});
		if (!data)
			return;
		this._books = data;
		this.books = data;
		this.changeBook(data[0]);
		this.fetchingBooks = false;
		console.log(data);
	}
}