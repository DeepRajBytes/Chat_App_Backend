const express = require("express");
const { protect } = require("../middlewares/authMiddlewear");
const router = express.Router();
const {senMessageController , allMessageController } = require("../controllers/messageController")

router.route('/').post(protect , senMessageController)
router.route("/:chatId").get(protect, allMessageController);

module.exports = router