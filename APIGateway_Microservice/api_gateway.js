const express = require('express');
const httpProxy = require('http-proxy');
const jwt = require('jsonwebtoken');
const { Readable } = require('stream');
require('dotenv').config();

const app = express();
const proxy = httpProxy.createProxyServer();

const PORT = 4000;

const ADMIN_SERVICE = 'http://localhost:5001';
const USER_SERVICE = 'http://localhost:5000';

app.use(express.json());

function authenticateToken(req, res, next) {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
        return res.status(401).json({
            message: "TOKEN REQUIRED"
        });
    }

    const token = authHeader.split(' ')[1];

    jwt.verify(token, process.env.JWT_SECRET, (error, user) => {
        if (error) {
            if (error.name === 'TokenExpiredError') {
                return res.status(403).json({
                    message: "TOKEN EXPIRED"
                });
            }

            return res.status(403).json({
                message: "INVALID TOKEN"
            });
        }

        req.user = user;
        next();
    });
}

function forwardRequest(req, res, target) {
    if (req.body && Object.keys(req.body).length > 0) {
        const body = JSON.stringify(req.body);

        req.headers['content-type'] = 'application/json';
        req.headers['content-length'] = Buffer.byteLength(body);

        proxy.web(req, res, {
            target: target,
            changeOrigin: true,
            ignorePath: false,
            buffer: Readable.from([Buffer.from(body)])
        });
    } else {
        proxy.web(req, res, {
            target: target,
            changeOrigin: true,
            ignorePath: false
        });
    }
}

app.use('/admin', authenticateToken, (req, res) => {
    if (req.user.role !== 'admin') {
        return res.status(403).json({
            message: "ACCESS DENIED"
        });
    }

    forwardRequest(req, res, ADMIN_SERVICE);
});

app.use('/user', authenticateToken, (req, res) => {
    if (req.user.role !== 'user') {
        return res.status(403).json({
            message: "ACCESS DENIED"
        });
    }

    forwardRequest(req, res, USER_SERVICE);
});

app.listen(PORT, () => {
    console.log(`API Gateway Started at Port ${PORT}`);
});