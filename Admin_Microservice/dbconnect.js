const mongoose = require('mongoose');

const uri = "mongodb+srv://sengchandaraboth123_db_user:user123@chandaraboth.fw03uvq.mongodb.net/test?appName=Chandaraboth";

async function run() {
    try {
        await mongoose.connect(uri);
        await mongoose.connection.db.admin().command({ ping: 1 });

        console.log("Pinged your deployment. You successfully connected to MongoDB!");
    } catch (error) {
        console.log("MongoDB connection error:", error);
    }
}

run();

module.exports = mongoose;