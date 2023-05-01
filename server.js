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

// socket 
let io = new Server(server)
io.listen(server)

io.on("connection", function (socket) {
  console.log("A user connected")
  socket.on("disconnect", function () {
    console.log("user disconnected")
  })
})