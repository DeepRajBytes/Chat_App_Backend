const asyncHandler = require("express-async-handler");
const User = require("../models/user.model");
const { name } = require("body-parser");

const allusers = asyncHandler(async (req, res) => {
  const keywords = req.query.search
    ? {
        $or: [
          { name: { $regex: req.query.search, $options: "i" } },
          { email: { $regex: req.query.search, $options: "i" } },
        ],
      }
    : {};
      const users = await User.find(keywords).find({_id:{$ne : req.user._id}})
      res.status(200).send(users);
});

module.exports = {
  allusers,
};
