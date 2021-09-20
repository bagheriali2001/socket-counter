const app = require("express")();
const http = require("http").Server(app);
const mongoose = require("mongoose");
const io = require("socket.io")(http, {
    cors: {
        origin: "*",
        methods: ["GET", "POST"],
    },
});
const dotenv = require("dotenv");
const jwt = require("jsonwebtoken");
const {Counter, User} = require("../models");
const bcryptjs = require("bcryptjs");
const scripts = require("../scripts")
dotenv.config()

const jwtDecode = (token) => {
    return result = jwt.verify(token, process.env.JWT_SECRET)
}

io.on("connection", async (socket) => {
    console.log("a socket connected! socket id: ", socket.id);
    const data = await Counter.find();
    socket.emit("hello", data);

    socket.on("updateCounter", async (data) => {
        try {
            console.log("**************************************************");
            console.log("updateCounter");
            console.log("data => ", data);
            const verification = jwtDecode(data.token)
            if (verification && verification.accessLevel > 0) {
                const { todayCount } = await Counter.findById(data.id).select(
                    "todayCount"
                );
                console.log("todayCount => ", todayCount);
                if(todayCount[data.type] == 0 && data.change == -1){
                    io.emit("updatedCount", {error: "Counts can not be zero"});
                    console.log("**************************************************");
                }
                else{
                    todayCount[data.type] += data.change
                    todayCount.total += data.change
                    const result = await Counter.findByIdAndUpdate(
                        data.id,
                        { todayCount , $inc: { totalCount: data.change } },
                        { new: true }
                    );
                    console.log("result => ", result);
                    io.emit("updatedCount", result);
                }
            }
        } catch (err) {
            console.log(err);
        }
    });

    socket.on("login", async (data) => {
        try {
            console.log("**************************************************");
            console.log("login");
            console.log("data => ", data);
            const user = await User.findOne({ username: data.username });
            console.log("user => ", user);
            const isEq = await bcryptjs.compare(data.password, user.password);
            console.log("isEq => ", isEq);
            if (isEq) {
                const token = jwt.sign({
                    accessLevel: user.accessLevel,
                    username: user.username
                },process.env.JWT_SECRET)
                socket.emit("logedIn", {
                    token,
                    accessLevel: user.accessLevel
                });
            }
            console.log("**************************************************");
        } catch (err) {
            console.log(err);
        }
    });

    socket.on("resetCounts", async (data) => {
        try {
            console.log("**************************************************");
            console.log("resetCounts");
            console.log("data => ", data);
            const user = await User.findOne({ username: data.username });
            console.log("user => ", user);
            if (user && user.accessLevel > 1) {
                const result = await Counter.findByIdAndUpdate(
                    data.id,
                    { todayCount: {
                            firstDosage: 0,
                            secondDosage: 0,
                            fails: 0,
                            total: 0
                        } },
                    { new: true }
                );
                console.log("result => ", result);
                io.emit("updatedCount", result);
            }
            console.log("**************************************************");
        } catch (err) {
            console.log(err);
        }
    });
});

const main = async () => {
    await mongoose.connect(process.env.MONGODB_URL);
    console.log("connected to mongoose!");
    http.listen(process.env.PORT, () => {
        console.log(`listening on ${process.env.PORT}!`);
    });

    //run this functions once to add documents to your db
    // scripts.createUsers()
    // scripts.createCounters()
};

module.exports = { main, http , app};
