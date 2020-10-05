const router = require('express').Router();

const bcrypt = require('bcryptjs');
const knex = require('../data/connection.js');

const Users = require('../users/users-model.js');

router.post('/register', (req, res) => {
    const userData = req.body;

    const hash = bcrypt.hashSync(userData.password, 8);
    userData.password = hash;

    Users.add(userData)
        .then(user => {
            res.status(201).json(user);
        })
        .catch(error => {
            res.status(500).json(error);
        })
})

router.post('/login', (req, res) => {
    let {username, password} = req.body;

    Users.findBy({username}).first()
        .then(user => {
            if(user && bcrypt.compareSync(password, user.password)) {
                req.session.user = user;
                res.status(200).json({message: `welcome ${user.username}`});
            } else {
                res.status(401).json({message: 'Invalid username or password'});
            }
        })
        .catch(error => {
            res.status(500).json(error);
        })
})

router.get('/logout', (req, res) => {
    if(req.session) {
        req.session.destroy(error => {
            if(error) {
                res.status(400).json({message: "could not log out: ", why: error})
            } else {
                res.status(200).json({message: 'successfully logged out'});
            }
        })
    } else {
        res.end();
    }
})


module.exports = router;