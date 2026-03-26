const express = require('express')
const app = express()
const dotenv= require('dotenv').config()
const router = require('./routes/routes')
const cors = require('cors');
const connectDb = require('./config/db')
const { Server } = require('socket.io')
const http= require('http')


const PORT = process.env.PORT || 3000
app.use(cors());
app.use(express.json());
app.use("/todo", router)

connectDb();
app.listen(PORT, () => {
    console.log(`server is running on port ${PORT}`);
})


const server = http.createServer(app)

const io = new Server(server, {
    cors: {
        origin:"*"
    }
})
require("./config/socket")(io);
console.log("Router loaded");