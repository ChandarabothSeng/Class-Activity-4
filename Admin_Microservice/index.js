const express = require('express');

const app = express();
app.use(express.json());

require('./dbconnect.js');
const PersonModel = require('./person_schema.js');

app.get('/searchuser', async (req, res) => {
    try {
        const { name, email } = req.query;

        if (!name && !email) {
            return res.status(400).json({
                message: "Please provide name or email"
            });
        }

        let user;

        if (email) {
            user = await PersonModel.findOne(
                { emailid: email },
                { pass: 0, _id: 0, __v: 0 }
            );
        } else {
            user = await PersonModel.findOne(
                { name: name },
                { pass: 0, _id: 0, __v: 0 }
            );
        }

        if (!user) {
            return res.status(404).json({
                message: "USER NOT FOUND"
            });
        }

        res.status(200).json(user);

    } catch (error) {
        console.log("Search user error:", error);

        res.status(500).json({
            message: "Unable to search user"
        });
    }
});

app.get('/viewalluser', async (req, res) => {
    try {
        const users = await PersonModel.find(
            {},
            { pass: 0, _id: 0, __v: 0 }
        );

        res.status(200).json(users);

    } catch (error) {
        console.log("View users error:", error);

        res.status(500).json({
            message: "Unable to retrieve users"
        });
    }
});

app.delete('/deluser', async (req, res) => {
    try {
        const { email } = req.body;

        if (!email) {
            return res.status(400).json({
                message: "Email is required"
            });
        }

        const deletedUser = await PersonModel.findOneAndDelete({
            emailid: email
        });

        if (!deletedUser) {
            return res.status(404).json({
                message: "USER NOT FOUND"
            });
        }

        res.status(200).json({
            message: "USER DELETED SUCCESSFULLY"
        });

    } catch (error) {
        console.log("Delete user error:", error);

        res.status(500).json({
            message: "Unable to delete user"
        });
    }
});

app.listen(5001, () => {
    console.log("Admin Server Started at Port 5001");
});