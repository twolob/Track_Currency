const express = require('express');
const router = express.Router();
const connection = require('./db_config.js');
const bodyParser = require('body-parser');
const path = require('path');

// router.use(bodyParser.urlencoded({ extended: false }));
// router.use(express.static(path.join(__dirname, 'public')));

// Handle GET request to render the page initially
router.get('/', (req, res) => {
    res.render('index', { err_message: '' });  // Pass an empty error message
});

router.post('/', (req, res) => {
    const email = req.body.newsletterEmail;
    const emailPattern = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;

    if (!emailPattern.test(email)) {
        return res.render('index', { err_message: 'Invalid email format' });
    }

    const checkQuery = `SELECT email FROM newsletter_subscribers WHERE email = ?`;
    connection.query(checkQuery, [email], (err, results) => {
        if (err) {
            console.log('Error while fetching the data!');
            return res.render('index', { err_message: 'Error while fetching the data!' });
        }

        if (results.length > 0) {
            console.log('Email already exists!');
            return res.render('index', { err_message: 'Email already exists!' });
        }

        const query = 'INSERT INTO newsletter_subscribers(email) VALUES(?)';
        connection.query(query, [email], (err, results) => {
            if (err) {
                console.log('Error while inserting the data!');
                return res.render('index', { err_message: 'Error while inserting the data!' });
            }
            console.log('Data inserted successfully!');
            return res.render('index', { err_message: 'Thank you for subscribing!' });
        });
    });
});

module.exports = router;