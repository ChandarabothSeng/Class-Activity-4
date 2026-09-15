const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
require('dotenv').config();

const app = express();
app.use(express.json());

require('./dbconnect.js');
const PersonModel = require('./person_schema.js');

app.post('/login', async (req, res) => {
    try {
        const { email, password, role } = req.body;

        if (!email || !password || !role) {
            return res.status(400).json({
                message: "Email, password, and role are required"
            });
        }

        const user = await PersonModel.findOne({
            emailid: email,
            role: role
        });

        if (!user) {
            return res.status(401).json({
                message: "INVALID USER"
            });
        }

        const passwordMatch = await bcrypt.compare(password, user.pass);

        if (!passwordMatch) {
            return res.status(401).json({
                message: "INVALID USER"
            });
        }

        const token = jwt.sign(
            {
                id: user.id,
                emailid: user.emailid,
                role: user.role
            },
            process.env.JWT_SECRET,
            { expiresIn: '1h' }

        );

        res.status(200).json({
            message: "LOGIN SUCCESSFUL",
            token: token
        });

    } catch (error) {
        console.log("Login error:", error);

        res.status(500).json({
            message: "Login failed"
        });
    }
});

app.listen(5002, () => {
    console.log("Login Server Started at Port 5002");
});