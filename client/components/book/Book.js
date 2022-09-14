import React from "react"
import {observer} from "mobx-react"

export const Book = observer(function Book({book}) {
	let { id, name, povCharacters } = book;
	return (
		<div className="Book">
			<div className="cover">
				<img src={`http://localhost:3000/bookImage/${id}`} alt="Hello"/>
			</div>
			<div className="name">
				<p>{name}</p>
			</div>
			<div className="povCharacters">
				{povCharacters.map(char => {
					return (
						<div key={char._id} className="tag">{char.name}</div>
					)
				})}
			</div>
		</div>
	)
});