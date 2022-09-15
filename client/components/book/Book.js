import React,{useState,useRef,useEffect} from "react"
import {observer} from "mobx-react"
import { URIS } from "Api"
import classnames from "classnames"
import axios from "axios"
import { Spinner } from "./../loading/loading"

export const Book = observer(function Book({book}) {
	let { id, name, povCharacters } = book;
	const [loading, loadingImage] = useState(true);
	const [image, setImage] = useState('');

	useEffect(() => {
		loadingImage(true);
		axios.get(URIS.image(id)).then(({data}) => {
			if (!data) return;
			setImage(data);
			loadingImage(false);
		});
	}, [id])


	return (
		<div className="Book">
			<div className="cover">
				{loading ? (
					<Spinner green/>
				) : (
					<>
						<img className="blurred" src={image} alt={name}/>
						<img src={image} alt={name}/>
					</>
				)}
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