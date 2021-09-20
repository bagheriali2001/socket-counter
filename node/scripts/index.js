const bcrypt = require("bcryptjs");
const {User, Counter} = require("../models");

exports.createUsers = async () => {
    const hashPassword1 = await bcrypt.hash("usersPassword", 12)
    const hashPassword2 = await bcrypt.hash("adminsPassword", 12)
    const user1 = new User({
        accessLevel: 1,
        username: "usersUsername",
        password: hashPassword1,
    })
    await user1.save()
    const user2 = new User({
        accessLevel: 2,
        username: "adminsUsername",
        password: hashPassword2,
    })
    await user2.save()
}

exports.createCounters = async () => {
    const counter1 = new Counter({
        name: "firstCounterName",
        todayCount: {
            firstDosage: 0,
            secondDosage: 0,
            fails: 0,
            total: 0
        },
        totalCount: 0,
    })
    await counter1.save()

    const counter2 = new Counter({
        name: "secondCounterName",
        todayCount: {
            firstDosage: 0,
            secondDosage: 0,
            fails: 0,
            total: 0
        },
        totalCount: 0,
    })
    await counter2.save()
    const counter3 = new Counter({
        name: "thirdCounterName",
        todayCount: {
            firstDosage: 0,
            secondDosage: 0,
            fails: 0,
            total: 0
        },
        totalCount: 0,
    })
    await counter3.save()
}