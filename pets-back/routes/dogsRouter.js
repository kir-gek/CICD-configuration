const Router = require("express");
const router = new Router();
const DogController = require("../controllers/dogsController")

router.post("/", DogController.postBreed);
router.get("/", DogController.getBreed);
router.put("/", DogController.updateBreed);
router.delete("/:id", DogController.deleteBreed)
router.get("/test", DogController.getTest)

module.exports = router;