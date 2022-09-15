export const ENV = "production"
// export const ENV = "production"

let {href} = window.location;

const envBased = (prod, dev, test) => {
	switch (ENV) {
		case "development": return dev;
		case "production": return prod;
		case "test": return test;
		default: throw new Error(`invalid env: '${ENV}'`);
	}
}

// export const API = ENV === "development" ? "http://localhost:3001/" : href+".netlify/functions/api/"
export const API = envBased(`${href}.netlify/functions/api/`, `${href}:3001/`, `${href}:3001/`)