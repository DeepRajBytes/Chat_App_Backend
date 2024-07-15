const dotenv = require("dotenv");
dotenv.config();
const colors = require("colors");
const express = require("express");
const app = express();
const cors = require("cors");
const bodyParser = require("body-parser");
const path = require("path");

app.use(cors());
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

const connectDB = require("./config/db");
connectDB();

app.get("/", (req, res) => {
  res.send("hello world");
});

const userRoutes = require("./routes/userRoutes");
app.use("/api/user", userRoutes);

const userDetails = require("./routes/search.route");
app.use("/api/details", userDetails);

const chatRoutes = require("./routes/chat.routes");
app.use("/api/chat", chatRoutes);

const messageRoute = require("./routes/message.routes");
app.use("/api/message", messageRoute);

// const ChatGptRoute = require("./routes/ChatGptRoute.routes")
// app.use("/api/chatgpt" , ChatGptRoute);

// ================Deploye Code ===================
// const __dirname1 = path.resolve();

// if (process.env.NODE_ENV === "production") {
//   app.use(express.static(path.join(__dirname1, "frontend", "build")));

//   app.get("*", (req, res) =>
//     res.sendFile(path.resolve(__dirname1, "frontend", "build", "index.html"))
//   );
// } else {
//   app.get("/", (req, res) => {
//     res.send("API is running..");
//   });
// }

// ================Deploye Code ===================

const { notFound, errorhandle } = require("./middlewares/errorMiddlewear");
app.use(notFound);
app.use(errorhandle);

const PORT = process.env.PORT || 5000;
const server = app.listen(PORT, () => {
  console.log(`Server running on : http://localhost:${PORT}/`.bgBlue.bold);
});

const io = require("socket.io")(server, {
  pingTimeout: 70000,
  cors: {
    origin: "*",
  },
});

io.on("connection", (socket) => {
  console.log("Connected to Socket.IO");

  socket.on("setUp", (userData) => {
    if (userData && userData._id) {
      socket.join(userData._id);
      //   console.log("User joined room: ", userData._id);
      socket.emit("connected");
    } else {
      console.error("No user data received");
    }
  });

  socket.on("join chat", (room) => {
    socket.join(room);
    console.log("user join party", room);
  });

  socket.on("typing", (room) => socket.in(room).emit("typing"));
  socket.on("stop typing", (room) => socket.in(room).emit("stop typing"));

  socket.on("new message", (newMessageReceived) => {
    const chat = newMessageReceived.chat;
    if (!chat.users) return console.log("chat.users not found");

    chat.users.forEach((user) => {
      if (user._id == newMessageReceived.sender._id) return;

      socket.in(user._id).emit("Message Received", newMessageReceived);
    });
  });

  socket.off("setUp", () => {
    console.log("User disconnected from Socket.IO");
    socket.leave(userData._id);
  });

  socket.on("disconnect", () => {
    console.log("User disconnected from Socket.IO");
  });
});
