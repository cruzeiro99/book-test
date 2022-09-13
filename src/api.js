const express = require("express");

const app = express();
const router = express.Router();

router.get("/", (req, res) => {
	res.send("HELLO");
})

app.use('.netlify/functions/api', router);

module.exports = app;
module.exports.handler = router;