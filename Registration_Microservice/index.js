const express = require('express');
const bcrypt = require('bcryptjs');

const app = express();
app.use(express.json());

require('./dbconnect.js');
const PersonModel = require('./person_schema.js');

function generateId() {
    return Math.floor(1000 + Math.random() * 9000);
}

app.post('/register', async (req, res) => {
    try {
        const { name, email, password, mobile, role } = req.body;

        if (!name || !email || !password || !mobile || !role) {
            return res.status(400).json({
                message: "All fields are required"
            });
        }

        const existingUser = await PersonModel.findOne({
            emailid: email
        });

        if (existingUser) {
            return res.status(409).json({
                message: "Email already registered"
            });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = new PersonModel({
            id: generateId(),
            name: name,
            emailid: email,
            pass: hashedPassword,
            mobile: mobile,
            role: role
        });

        await newUser.save();

        res.status(201).json({
            message: "REGISTRATION SUCCESSFUL"
        });

    } catch (error) {
        console.log("Registration error:", error);

        res.status(500).json({
            message: "Registration failed"
        });
    }
});

app.listen(5003, () => {
    console.log("Registration Server Started at Port 5003");
});