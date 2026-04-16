const Chat = require('../model/chat');

module.exports = (io) => {
    io.on("connection", (socket) => {
        console.log("User connected:", socket.id);

        socket.on("join", ({ userId }) => {
            socket.join(userId);
        });

        socket.on("sendMessage", async ({ userId, message, sender }) => {
            try {
                let chat = await Chat.findOne({ userId });

                if (!chat) {
                    chat = await Chat.create({
                        userId,
                        messages: []
                    });
                }

                chat.message.push({
                    sender,
                    text: message
                });

                await chat.save();

                io.to(userId).emit("receiveMessage", {
                    sender,
                    message
                });

            } catch (err) {
                console.log(err);
            }
        });

        socket.on("disconnect", () => {
            console.log("User disconnected");
        });
    });
};