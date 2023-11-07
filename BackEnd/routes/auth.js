const express = require('express');
const {body, validationResult} = require("express-validator");
const helper = require("../config/helpers");
const bcrypt = require('bcrypt');
const sendmail = require("../config/email");
const {database} = require("../config/helpers");
const jwt = require('jsonwebtoken');
const verifyToken = require('../verifyToken');
const router = express.Router();

const secret = "1SBz93MsqTs7KgwARcB0I0ihpILIjk3w";

/* REGISTER ROUTE */
router.post(`/register`, [
        body('email').custom(value => {
            return helper.database.table('users').filter({
                $or:
                    [
                        {email: value}
                    ]
            }).get().then(user => {
                if(user) {
                    return Promise.reject('Email already exists, choose another one.');
                }
            })
        }),
        body('username').custom(value => {
            return helper.database.table('users').filter({
                $or:
                    [
                        {username: value}
                    ]
            }).get().then(user => {
                if(user) {
                    return Promise.reject('Username already exists, choose another one.');
                }
            })
        })
    ],
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(401).json({message: errors.array().find(value => value.msg).msg});
        } else {
            let email = req.body.email;
            let username = (req.body.username).toLowerCase();
            let password = await bcrypt.hash(req.body.password, 10);
            let fname = req.body.fname;
            let lname = req.body.lname;
            let age = req.body.age;

            helper.database.table('users').insert({
                username: username,
                password: password,
                email: email,
                role: 'user',
                fname: fname || null,
                lname: lname || null,
                age: age
            }).then(lastId => {
                if (lastId.insertId > 0) {
                    sendmail.RegisterEmail(email);
                    res.status(201).json({message: 'Registration successful.'});
                } else {
                    res.status(501).json({message: 'Registration failed.'});
                }
            }).catch(err => res.status(433).json({error: err.msg}));
        }
    });

/* CONTACT ROUTE */
router.post(`/contact`,[],
    async (req, res) => {
        let email = req.body.email;
        let message = req.body.message;
        sendmail.ContactEmail(email, message);
        res.status(201).json({message: 'Thank you for writing to us, we will get back to you shortly'});
    })

/* LOGIN ROUTE */
router.post(`/login`,[],
    async (req, res) => {
        const myEmail = req.body.email;
        const myUsername = req.body.username;
        const myPlaintextPassword = req.body.password;
        const user = await database.table('users').filter({$or:[{email: myEmail}, {username: myUsername}]}).get();
        if(user) {
            bcrypt.compare(myPlaintextPassword, user.password, function (err, response) {
                if(!err) {
                    if(response) {
                        const token = jwt.sign({email: user.email, username: user.username}, secret, {
                            expiresIn: '1h'
                        })
                        res.status(201).json({token: token, auth: response, user: user})
                    } else {
                        res.status(401).json({message: 'Password is incorrect'})
                    }
                } else {
                    res.status(401).json({message: 'Something went wrong...!'})
                }
            });
        } else {
            res.status(401).json({message: 'Username or Email is incorrect'})
        }
    })


router.get(`/profile`, verifyToken, (req, res) => {
    if(req && req.jwt) {
        res.status(201).json({data: 'ok'});
    }
})

module.exports = router;
