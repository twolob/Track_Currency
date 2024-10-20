const express = require('express')
const router = express.Router();
const connection = require('./db_config');
const bcrypt = require('bcrypt');
// const bodyParser = require('body-parser')
const path = require('path');

// router.use(bodyParser.urlencoded({ extended: false }));
// router.use(express.static(path.join(__dirname, 'public')));

router.get('/register', (req, res)=>{
    res.render('register', {errorMessage: ''});
});

router.post('/register', async (req, res)=>{
    const {fullname, username, email, phone, country, currency, password} = req.body;
    const hashPassword = await bcrypt.hash(password, 10);

    //validation
    if (!fullname || !username || !email || !country || !currency || !password) {
        return res.status(400).render('register', {errorMessage: 'All required fields must be filled out (*).'});
    }
    
    // Username format validation: no uppercase letters or special characters
    const usernameRegex = /^[a-z0-9]+$/;
    if (!usernameRegex.test(username)) {
        return res.render('register', { errorMessage: 'Username must contain only lowercase letters and numbers.' });
    }

    // Email format validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        return res.render('register', { errorMessage: 'Invalid email format.' });
    }

    // Password length validation
    if (password.length < 6) {
        return res.render('register', { errorMessage: 'Password must be at least 6 characters long.' });
    }

    // Phone number validation (optional, only if provided)
    const phoneRegex = /^\d+$/; // Simple regex for digits only
    if (phone && !phoneRegex.test(phone)) {
        return res.render('register', { errorMessage: 'Invalid phone number format.' });
    }
    //Checking for username or email
    const checkUniqueQuery = `SELECT * FROM users WHERE username = ? OR email = ?`;
    connection.query(checkUniqueQuery, [username, email], (err, results)=>{
        if(err){
            throw console.log('Error while inserting the database!');
        }
        //Checking if data is return
        if(results.length > 0){
            //Check which one is taken
            const existingUser = results[0];
            if(existingUser.username == username){
                return res.render('register', {errorMessage: 'Username is already taken.'});
            }
            else if(existingUser.email == email){
                return res.render('register', {errorMessage: 'Email is already taken.'});
            }
        }
        //inserting the data into the database
        const insertQuery = `INSERT INTO users(fullname, username, email, phone, country, currency, password) VALUE(?, ?, ?, ?, ?, ?, ?)`;
        connection.query(insertQuery, [fullname, username, email, phone, country, currency, hashPassword], (err, results)=>{
            if(err){
                throw console.log('Error while inserting the data!');
            }
            console.log('Data inserted successfully!')
            res.redirect('login');
        });
    });
});
module.exports = router;