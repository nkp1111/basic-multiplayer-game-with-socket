const express = require("express")
const app = express()
const { Server } = require("socket.io")

const port = process.env.PORT || 3000

app.use(express.static(__dirname + "/public"))

app.get("/", (req, res) => {
  res.sendFile(__dirname + "/index.html")
})

// express server 
const server = app.listen(port, () => {
  console.log(`Listening on port ${port}`)
})

const players = {}

// socket 
let io = new Server(server)
io.listen(server)

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

  // on disconnection of a player
  socket.on("disconnect", function () {
    console.log("user disconnected")
    delete players[socket.id]
    socket.emit("userDisconnected", socket.id)
  })
})