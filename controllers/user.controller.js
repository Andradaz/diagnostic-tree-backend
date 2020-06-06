const User = require('../models/user.model')

exports.registerUserData = function (req, res) {

    if (req.body.email &&
        req.body.username &&
        req.body.password &&
        req.body.firstname &&
        req.body.lastname) {
        let userData = {
            email: req.body.email,
            username: req.body.username,
            password: req.body.password,
            firstname: req.body.firstname,
            lastname: req.body.lastname,
            admin: false
        }

        User.create(userData, function (err, user) {
            if (err) {
                let data = {
                    error: "err"
                }
                return res.send(data)
            } else {
                let data = {
                    msg: "Success"
                }
                return res.send(data)
            }
        });
    }
    else{
        let data = {
            error:"All fields required."
        }
        res.send(data)
    }

}

exports.signInUserData = function (req, res) {
    if (req.body.logemail && req.body.logpassword) {
        User.authenticate(req.body.logemail, req.body.logpassword, function (error, user) {
            if (error || !user) {
                return res.send({ error: 'Wrong email or password' })
            } else {
                let data = {
                    "userid": user._id,
                    "username": user.username,
                    "admin": user.admin,
                    "lastname": user.lastname,
                    "firstname": user.firstname
                }
                return res.send(data)
            }
        });
    } else {
        res.send({ error: 'All fields required' })
    }  
}