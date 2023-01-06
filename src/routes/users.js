var express = require("express");
var router = express.Router();
const upload = require("../utils/multer");
const controller = require("../controller/user");

/* GET users listing. */
router.get("/", function (req, res, next) {
  res.send("respond with a resource");
});

//register
router.post("/register", controller.register);

//LOGIN
router.post("/login");

module.exports = router;
