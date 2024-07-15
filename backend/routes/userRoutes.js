const express = require("express");
const { userRegister, userLogin, userUpdate } = require("../controllers/authController");
const { protect } = require("../middlewares/authMiddlewear");
const router = express.Router();


router.route("/register").post(userRegister);
router.post("/login", userLogin);
router.put("/update", protect , userUpdate);
module.exports = router;
