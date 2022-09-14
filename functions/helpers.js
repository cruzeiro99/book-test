const { ENV } = process.env;

const envBased = (prod, dev, test) => {
	switch (ENV) {
		case "production": return prod;
		case "development": return dev;
		case "test": return test;
		default:
			throw new Error(`Env ${ENV} not known`);
	}
}

module.exports = {
	envBased
}