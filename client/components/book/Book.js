import React from "react"
import {observer} from "mobx-react"
import { URIS } from "Api"

export const Book = observer(function Book({book}) {
	let { id, name, povCharacters } = book;
	return (
		<div className="Book">
			<div className="cover">
				<img src={URIS.image(id)} alt="Hello"/>
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