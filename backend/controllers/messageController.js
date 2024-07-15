const expressAsyncHandler = require("express-async-handler")
const Message = require('../models/message.model');
const User = require("../models/user.model");
const Chat = require("../models/chat.model");


const senMessageController = expressAsyncHandler(async (req, res) => {
    const {content , chatId} = req.body
    
    if(!content || !chatId){
        console.log("Invalid data or content passed in the request");
        return res.status(400).send("Invalid data or content passed in the request");
    }

    var newMessage = {
      sender: req.user._id,
      content: content,
      chat:chatId
    };

    try {
        var message = await Message.create(newMessage);

        message = await message.populate("sender", "name picture");
        message = await message.populate("chat");
        message = await User.populate(message , {
            path:"chat.users",
            select:"name picture email"
        })

        await Chat.findByIdAndUpdate(req.body.chatId, {
          latestMessage: message,
        });
        res.json(message)
    } catch (error) {
        res.status(400)
        throw new Error(error.message)
    }


});

const allMessageController = expressAsyncHandler(async (req, res) => {
        try {
            const message = await Message.find({ chat: req.params.chatId })
              .populate("sender", "name picture email")
              .populate({
                path: "chat",
                populate: {
                  path: "users",
                  select: "name picture email",
                },
              });
              
            res.json(message);
        } catch (error) {
            res.status(400)
            throw new Error(error.message);
        }
});

module.exports = {
    senMessageController,
    allMessageController
}