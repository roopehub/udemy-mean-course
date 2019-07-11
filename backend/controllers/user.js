const bcrypt = require("bcrypt");
const jwt = require('jsonwebtoken');

const User = require("../models/user");

exports.createUser = (req, res, next) => {
  bcrypt.hash(req.body.password, 10)
    .then(hash => {
      const user = new User({
        email: req.body.email,
        password: hash
      });
      user
        .save()
        .then(result => {
          res.status(201).json({
            message: "user created",
            data: result
          });
        })
        .catch(() => {
          res.status(500).json({
            message: 'Invalid user authentication credentials'
          })
        })
    });
}

exports.userLogIn = (req, res, next) => {
  let fetchedUser;
  User.findOne({
      email: req.body.email
    })
    .then(user => {
      fetchedUser = user;
      if (!user) {
        return res.status(401).json({
          message: "Authentication failed"
        })
      }
      return bcrypt.compare(req.body.password, user.password);
    })
    .then(result => {
      if (!result) {
        return res.status(401).json({
          message: "Authentication failed, wrong password"
        });
      }
      const token = jwt.sign({
          email: fetchedUser.email,
          userId: fetchedUser._id
        },
        "secret_this_should_be_longer", {
          expiresIn: "1h"
        }
      );
      res.status(200).json({
        token: token,
        expiresIn: 3600,
        userId: fetchedUser._id
      });
    })
    .catch(err => {
      return res.status(401).json({
        message: "Invalid user authentication credentials"
      })
    });
}
