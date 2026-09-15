const express = require('express');

const app = express();
app.use(express.json());

require('./dbconnect.js');
const PersonModel = require('./person_schema.js');

app.get('/viewprofile', async (req, res) => {
    try {
        const { email } = req.query;

        if (!email) {
            return res.status(400).json({
                message: "Email is required"
            });
        }

        const user = await PersonModel.findOne(
            { emailid: email },
            { pass: 0, _id: 0, __v: 0 }
        );

        if (!user) {
            return res.status(404).json({
                message: "USER NOT FOUND"
            });
        }

        res.status(200).json(user);

    } catch (error) {
        console.log("View profile error:", error);

        res.status(500).json({
            message: "Unable to retrieve profile"
        });
    }
});

app.put('/updateprofile', async (req, res) => {
    try {
        const { email, name, mobile } = req.body;

        if (!email) {
            return res.status(400).json({
                message: "Email is required"
            });
        }

        const updatedUser = await PersonModel.findOneAndUpdate(
            { emailid: email },
            {
                name: name,
                mobile: mobile
            },
            { new: true }
        );

        if (!updatedUser) {
            return res.status(404).json({
                message: "USER NOT FOUND"
            });
        }

        res.status(200).json({
            message: "PROFILE UPDATED SUCCESSFULLY",
            user: {
                id: updatedUser.id,
                name: updatedUser.name,
                emailid: updatedUser.emailid,
                mobile: updatedUser.mobile,
                role: updatedUser.role
            }
        });

    } catch (error) {
        console.log("Update profile error:", error);

        res.status(500).json({
            message: "Unable to update profile"
        });
    }
});

app.listen(5000, () => {
    console.log("User Server Started at Port 5000");
});