const Router = require("express");
const router = new Router();
const dogsRouter = require("./dogsRouter");

router.use("/dogs", dogsRouter);

module.exports = router;
