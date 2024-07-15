const AsyncHandler = require("express-async-handler");
const Chat = require("../models/chat.model");
const User = require("../models/user.model");
const { use } = require("bcrypt/promises");
// const Message = require("../models/message.model");

const accessChat = AsyncHandler(async (req, res) => {
  const { userID } = req.body;
  if (!userID) {
    console.log("userid params not send with requesr");
    res.status(400);
  }
  var isChat = await Chat.find({
    isGroupChat: false,
    $and: [
      { users: { $elemMatch: { $eq: req.user._id } } },
      { users: { $elemMatch: { $eq: userID } } },
    ],
  })
    .populate("users", "-password")
    .populate("latestMessage");

  isChat = await User.populate(isChat, {
    path: "latestMessage.sender",
    select: "name pic email",
  });

  if (isChat.length > 0) {
    res.send(isChat[0]);
  } else {
    var chatData = {
      chatName: "singleChat",
      isGroupChat: false,
      users: [req.user._id, userID],
    };

    try {
      const createdChat = await Chat.create(chatData);
      const FullChat = await Chat.findOne({
        _id: createdChat._id,
      }).populate("users", "-password");

      res.status(200).send(FullChat);
    } catch (error) {
      res.status(500);
      throw new Error(error);
    }
  }
});

const fetchChat = AsyncHandler(async (req, res) => {
  try {
    await Chat.find({ users: { $elemMatch: { $eq: req.user._id } } })
      .populate("users", "-password")
      .populate("groupAdmin", "-password")
      .populate("latestMessage")
      .sort({ updatedAt: -1 })
      .then(async (results) => {
        results = await User.populate(results, {
          path: "latestMessage.sender",
          select: "name pic email",
        });
        res.status(200).send(results);
      });
  } catch (error) {
    res.status(400);
    throw new Error(error.message);
  }
});

const createGroupChat = AsyncHandler(async (req, res) => {
  if (!req.body.users || !req.body.name) {
    return res.status(400).send({ message: "Please Fill all the feilds" });
  }

  var users = JSON.parse(req.body.users);

  if (users.length <= 2) {
    return res
      .status(400)
      .send("More than 2 users are required to form a group chat");
  }

  users.push(req.user);

  try {
    const groupChat = await Chat.create({
      chatName: req.body.name,
      users: users,
      isGroupChat: true,
      groupAdmin: req.user,
    });

    const fullGroupChat = await Chat.findOne({ _id: groupChat._id })
      .populate("users", "-password")
      .populate("groupAdmin", "-password");

    res.status(200).json(fullGroupChat);
  } catch (error) {
    res.status(400);
    throw new Error(error.message);
  }
});

const renameGroup = AsyncHandler(async (req, res) => {
  const { chatId, chatName } = req.body;

  const updatedChat = await Chat.findByIdAndUpdate(
    chatId,
    {
      chatName: chatName,
    },
    {
      new: true,
    }
  )
    .populate("users", "-password")
    .populate("groupAdmin", "-password");

  if (!updatedChat) {
    res.status(404).send({ message: "chat not found" });
    throw new Error("chat not found");
  } else {
    res.json(updatedChat);
  }
});

const addToGroup = AsyncHandler(async (req, res) => {
  const { chatId, userId } = req.body;

  const addedData = await Chat.findByIdAndUpdate(
    chatId,
    {
      $push: {
        users: userId,
      },
    },
    {
      new: true,
    }
  )
    .populate("users", "-password")
    .populate("groupAdmin", "-password");

  if (!addedData) {
    res.status(400).send({ message: "Chat Not Found" });
    throw new Error("Data missing");
  } else {
    res.json(addedData);
  }
});

const removeFromGroup = AsyncHandler(
  async (req, res) => {
    const { chatId, userId } = req.body;
    // console.log("bhai bandhu1", chatId);
    const removedUser = await Chat.findByIdAndUpdate(chatId, {
      $pull: {
        users: userId,
      },
    })
      .populate("users", "-password")
      .populate("groupAdmin", "-password");

    const updatechat = await Chat.findById(chatId)
      .populate("users", "-password")
      .populate("groupAdmin", "-password");

    // console.log("ye nikla", updatechat);
    if (!removedUser) {
      res.status(400).send({ message: "User Not Foundin Group" });
      throw new Error("Data missing");
    } else {
      res.json(updatechat);
    }
  },
  {
    new: true,
  }
);

module.exports = {
  accessChat,
  fetchChat,
  createGroupChat,
  renameGroup,
  addToGroup,
  removeFromGroup,
};
