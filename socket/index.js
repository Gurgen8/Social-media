const { default: Users } = require("../server/models/Users");
const io = require("socket.io")(8900, {
  cors: {
    origin: "http://localhost:3000",

  },
});

let users = [];



const addUser = (userId, socketId) => {
  !users.some((user) => user.userId === userId) &&
    users.push({ userId, socketId });
};

const online = (userId) => {
  users.push(userId)
}

const removeUser = (socketId) => {
  users = users.filter((user) => user.socketId !== socketId);
};

const getUser = (userId) => {
  return users.find((user) => user.userId === userId);
};





io.on("connection", (socket) => {
  console.log("user conected", socket.id)


  //take userId and socketId from user

  socket.on("addUser", (userId) => {
    addUser(userId, socket.id);
    io.emit("getUsers", users);
  });


  ///typing messanger

  socket.on("typing", (data) => {
    socket.broadcast.emit("typing", (data))


  })

  socket.on("stopTyping", (data) => {
    socket.broadcast.emit("typing", (data))

  })

  ///calling user

  socket.on("calling", ({ userId, friendId }) => {
    socket.broadcast.emit("calling", { userId, friendId })

  })


  ///online-users

  socket.on("online", (userId) => {
    online(userId)
    io.emit("getUsers", users)

  })

  //send and get message

  socket.on("sendMessage", ({ senderId, receiverId, text, video, img, url }) => {
    const user = getUser(receiverId);
    io.to(user.socketId).emit("getMessage", {
      senderId,
      text,
      video,
      img,
      url,
      receiverId
    });
  });


  //when disconnect

  socket.on("disconnect", () => {
    console.log("a user disconnected!");
    removeUser(socket.id);
    io.emit("getUsers", users);
  });

});

