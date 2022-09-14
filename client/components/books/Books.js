import React from "react"
import {observer} from "mobx-react"
import {app} from "Store"

export const Books = observer(function Books() {
	return (
		<div className="Books">
			<div className="search">
				<input onChange={app.handleSearch} placeholder="Search" type="text" className="formField"/>
			</div>
			<div className="items">
				{app.books.map(book => {
					return (
						<div key={book._id} onClick={app.handleBookClick(book)} className="item">{book.name}</div>
					)
				})}
			</div>
		</div>
	)
});