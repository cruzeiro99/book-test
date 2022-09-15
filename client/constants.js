export const ENV = "development"
// export const ENV = "production"

let {href, hostname} = window.location;

const envBased = (prod, dev, test) => {
	switch (ENV) {
		case "development": return dev;
		case "production": return prod;
		case "test": return test;
		default: throw new Error(`invalid env: '${ENV}'`);
	}
}

export const API = envBased(`${href}.netlify/functions/api/`, `http://${hostname}:3000/`, `http://${hostname}:3000/`)
// export const API = envBased(`${href}api/`, `${href}:3001/`, `${href}:3001/`)