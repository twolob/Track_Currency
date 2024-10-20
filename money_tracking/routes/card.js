const express = require('express');
const router = express.Router();
const connection = require('./db_config');
const { authenticateToken } = require('./login');

// Applying authenticateToken middleware to all routes in this file
router.use(authenticateToken);

router.get('/card', (req, res) => {
    res.render('card');
});

router.post('/card', (req, res) => {
    const { card_type, card_amount, card_number, expiry_date } = req.body;
    const user_id = req.user.id; // Retrieve the authenticated user's ID

    // First, check if a card already exists for the user
    const checkCardQuery = `SELECT * FROM cards WHERE user_id = ?`;

    connection.query(checkCardQuery, [user_id], (err, result) => {
        if (err) {
            console.error('Error while checking card:', err);
            return res.status(500).send('Error while checking card');
        }

        if (result.length > 0) {
            // Card exists, proceed to update
            const updateCardQuery = `UPDATE cards 
                                     SET card_type = ?, card_amount = ?, card_number = ?, expiry_date = ? 
                                     WHERE user_id = ?`;

            connection.query(updateCardQuery, [card_type, card_amount, card_number, expiry_date, user_id], (err, result) => {
                if (err) {
                    console.error('Error while updating card:', err);
                    return res.status(500).send('Error while updating card');
                }

                console.log('Card updated successfully:', result);
                res.render('card');
            });
        } else {
            // No card exists, insert new card
            const insertCardQuery = `INSERT INTO cards (user_id, card_type, card_amount, card_number, expiry_date) 
                                     VALUES (?, ?, ?, ?, ?)`;

            connection.query(insertCardQuery, [user_id, card_type, card_amount, card_number, expiry_date], (err, result) => {
                if (err) {
                    console.error('Error while inserting card:', err);
                    return res.status(500).send('Error while inserting card');
                }

                console.log('Card inserted successfully:', result);
                res.render('card');
            });
        }
    });
});


module.exports = router;