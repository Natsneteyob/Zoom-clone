const express = require("express");

//add express
const app = express();

const server = require("http").Server(app);
//add io socket
const io = require("socket.io")(server);
//add uuid
const { v4: uuidv4 } = require("uuid");

const { ExpressPeerServer } = require("peer");
const peerServer = ExpressPeerServer(server, {
  debug: true,
});

// set view engine
app.set("view engine", "ejs");
// static routes
app.use(express.static("public"));
app.use("/peerjs", peerServer);

// routes to uuid
app.get("/", (req, res) => {
  res.redirect(`/${uuidv4()}`);
});

// routes to id
app.get("/:id", (req, res) => {
  res.render("room", { roomid: req.params.id });
});

// io connection
io.on("connection", (socket) => {
  socket.on("join-room", (roomid, userid) => {
    console.log("Daz Joined", roomid);
    socket.join(roomid);
    socket.to(roomid).emit("user-connected", userid);
    // socket.broadcast.to(roomid).emit("user-connected", userid);
    // socket.to(roomid).emit("user-disconnected",userid);

    
      console.log("someone joined", roomid);
        socket.on('message', (message) => {
            io.to(roomid).emit('createMessage', message);
    })

    socket.on("disconnect", () => {
      socket.to(roomid).emit("user_disconnected", userid);
  });
});
});

// server listen
server.listen(process.env.PORT || 3001);


// const express = require("express");
// const app = express();
// const server = require("http").Server(app);
// const io = require("socket.io")(server);
// const { v4: uuidV4 } = require("uuid");
// const { ExpressPeerServer } = require("peer");
// const peerServer = ExpressPeerServer(server, {
//   debug: true,
// });
// app.set("view engine", "ejs");
// app.use(express.static("public"));
// app.use("/peerjs", peerServer);
// app.get("/", (req, res) => {
//   res.redirect(`/${uuidV4()}`);
// });
// app.get("/:room", (req, res) => {
//   res.render("room", { roomId: req.params.room });
// });
// io.on("connection", (socket) => {
//   socket.on("join-room", (roomId, userId) => {
//     socket.join(roomId);
//     // socket.to(roomId).broadcast.emit("user_connected", userId);
//     socket.to(roomId).emit("user-disconnected", userId);
//     console.log("someone joined", roomId);
//     socket.on("message", (message) => {
//       io.to(roomId).emit("createMessage", message);
//     });
//     socket.on("disconnect", () => {
//       //socket.to(roomId).broadcast.emit("user_disconnected", userId);
//       socket.to(roomId).emit("user-disconnected", userId);
//     });
//   });
// });
// server.listen(process.env.PORT || 3001);