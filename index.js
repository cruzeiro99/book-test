const api = require("./api/api.js");
const PORT = process.env.PORT || 8080;
api.listen(PORT, () => {
	console.log("SERVER ON PORT", PORT)
})