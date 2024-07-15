// const expressAsyncHandler = require("express-async-handler");
// const OpenAI = require("openai");

// const openai = new OpenAI({
//   apiKey: process.env.OPENAI_API_KEY,
// });

// const ChatGptController = expressAsyncHandler(async (req, res) => {
//   const { prompt } = req.body;

//   try {
//     const chatCompletion = await openai.chat.completions.create({
//       model: "gpt-3.5-turbo",
//       messages: [{ role: "user", content: prompt }],
//     });

//     res.json({ answer: chatCompletion.choices[0].message.content.trim() });
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({
//       message: "Error fetching response from OpenAI API",
//       error: error.message,
//     });
//   }
// });

// module.exports = ChatGptController;
