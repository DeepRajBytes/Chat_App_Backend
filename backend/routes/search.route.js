const express = require("express");
const router = express.Router();
const {allusers} = require("../controllers/usersdata")
const { protect } = require("../middlewares/authMiddlewear");

router.route('/').get(protect,allusers)

module.exports = router;