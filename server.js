const express = require("express")
const app = express()
const server = require('http').createServer(app);
const io = require('socket.io')(server);

const port = process.env.PORT || 3000

app.use(express.static(__dirname + "/public"))

app.get("/", (req, res) => {
  res.sendFile(__dirname + "/index.html")
})

server.listen(port, () => {
  console.log(`Server running on port ${server.address().port}`)
})

const players = {}

// starting connection
io.on("connection", function (socket) {
  console.log("A user connected")
  // create a new player
  players[socket.id] = {
    rotation: 0,
    x: Math.floor(Math.random() * 700) + 50,
    y: Math.floor(Math.random() * 500) + 50,
    playerId: socket.id,
    team: (Math.floor(Math.random() * 2)) === 0 ? "red" : "blue"
  }

  // send all player information to new player
  socket.emit("currentPlayers", players)

  // send new player information to all players except new player
  socket.broadcast.emit("newPlayer", players[socket.id])

  socket.on('playerMovement', function (movementData) {
    players[socket.id].x = movementData.x;
    players[socket.id].y = movementData.y;
    players[socket.id].rotation = movementData.rotation;
    // emit a message to all players about the player that moved
    socket.broadcast.emit('playerMoved', players[socket.id]);
  });

  // on disconnection of a player
  socket.on("disconnect", function () {
    console.log("user disconnected")
    delete players[socket.id]
    io.emit("disconnected", socket.id)
  })
})