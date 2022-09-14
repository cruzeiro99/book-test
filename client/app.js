import React from "react"
import ReactDOM from "react-dom/client"

function App() {
	return (
		<div className="App">
			<main>
				<div className="left">
					<div className="Book">
						
					</div>
				</div>
				<div className="right">
					<div className="Books">
						
					</div>
				</div>
			</main>
		</div>
	)
}

ReactDOM.createRoot(document.querySelector('.root')).render(<App/>);