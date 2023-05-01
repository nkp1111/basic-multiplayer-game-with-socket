const express = require("express")
const app = express()
const server = require("http").Server(app)

const port = process.env.PORT || 3000

app.use(express.static(__dirname + "/public"))

app.get("/", (req, res) => {
  res.sendFile(__dirname + "/index.html")
})

server.listen(port, () => {
  console.log(`Listening on port ${server.address().port}`)
})