const express = require('express');
const router = express.Router();
const connection = require('./db_config');
const bcrypt = require('bcrypt');
const bodyParser = require('body-parser');
const path = require('path');
const jwt = require('jsonwebtoken');
const cookieParser = require('cookie-parser');

router.use(bodyParser.urlencoded({ extended: false }));
router.use(express.static(path.join(__dirname, 'public')));
router.use(cookieParser()); // Apply cookie-parser middleware here
//Using jwt middleware
const SECRET_KEY = 'secret_key';

router.get('/login', (req, res)=>{
    res.render('login.ejs', {errorMessage: ``})
});

router.post('/login', (req, res)=>{
    const {password, username} = req.body;
    //validation
    if (!username || !password) {
        return res.status(400).render('login', {errorMessage: 'All required fields must be filled out (*).'});
    }
    const query = `SELECT * FROM users WHERE username = ?`;
    connection.query(query, [username], (err, results)=>{
        if(err){
            throw console.log(`Error while retraving the data!`);
        }
        //Checking if user is found
        const resultLength = results.length;
        if(resultLength > 0){
            const hashPassword = results[0].password;
            const passwordMatch = bcrypt.compareSync(password, hashPassword);

            if(passwordMatch){
                //Generate jsonwebtoken
                const token = jwt.sign({
                    id: results[0].id,
                    username: results[0].username
                    },
                    SECRET_KEY,
                    {
                        expiresIn: '1h'
                    }
                );
                //Set cookie
                res.cookie('token', token, { httpOnly: true, maxAge: 3600000 });
                //If password matchest, redirect to the dashboard page  
                return res.redirect('/dashboard');
            }
            return res.render('login', {errorMessage: `Incorrect password!`});
        }
        res.render('login', {errorMessage: `User doesn't exist!`});
    });
    
});

// Middleware to authenticate JWT
const authenticateToken = (req, res, next)=>{
    const token = req.cookies.token || (req.header('Authorization') && req.header('Authorization').replace('Bearer ', ''));

    if (!token) {
        return res.status(401).render('login', { errorMessage: 'Access Denied: No Token Provided!' });
    }

    try {
        const decoded = jwt.verify(token, SECRET_KEY);
        req.user = decoded; // Store user data in request object
        next();
    } catch (err) {
        res.status(401).render('login', { errorMessage: 'Invalid or Expired Token!' });
    }
}

module.exports = {router, authenticateToken};