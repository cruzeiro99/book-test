import "./app.less"
import React, {useRef, useEffect, useState} from "react"
import ReactDOM from "react-dom/client"
import { app } from "Store"
import {observer} from "mobx-react"

import { Book } from "./components/book/Book"
import { Books } from "./components/books/Books"
import { PageLoading } from "./components/loading/loading"

const App = observer(function App() {
	const loaded = useRef(false);

	if (app.fetchingBooks === true)
		return <PageLoading/>

	return (
		<div className="App">
			<main>
				<div className="left">
					<Book book={app.book}/>
				</div>
				<div className="right">
					<Books/>
				</div>
			</main>
		</div>
	)
})

ReactDOM.createRoot(document.querySelector('.root')).render(<App/>);