const express = require("express");
const router = express.Router();
const { protect } = require("../middlewares/authMiddlewear");
const {
  accessChat,
  fetchChat,
  createGroupChat,
  renameGroup,
  removeFromGroup,
  addToGroup,
} = require("../controllers/chatController");


router.route('/').post(protect , accessChat)
router.route('/').get(protect, fetchChat);

//Group apis
router.route("/group").post(protect, createGroupChat);
router.route('/grouprename').put(protect , renameGroup);
router.route('/groupremove').put(protect, removeFromGroup);
router.route('/groupadd').put(protect , addToGroup);



module.exports = router