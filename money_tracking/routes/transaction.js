const express = require('express');
const router = express.Router();
const connection = require('./db_config');
const { authenticateToken } = require('./login');

// Applying authenticateToken middleware to all routes in this file
router.use(authenticateToken);

router.get('/transaction', (req, res) => {
    const user_id = req.user.id;
    console.log('User ID for transactions:', user_id); // log data
    const getTransactions = `SELECT id, transaction_title, amount, transaction_date, transaction_type, description FROM transactions WHERE user_id = ? ORDER BY transaction_date DESC`;
    connection.query(getTransactions, [user_id], (err, result) => {
        if (err) {
            console.error('Error while getting data from the database:', err);
            return res.status(500).send('An error occurred while fetching transactions');
        }
        console.log('Transactions:', result); // Add this log
        res.render('transaction', { transactions: result });
    });
});

router.post('/transaction', (req, res) => {
    const {transaction_title, amount, transaction_date, transaction_type, description} = req.body;
    const user_id = req.user.id;

    const transactionQuery = `INSERT INTO transactions(user_id, transaction_title, amount, transaction_date, transaction_type, description) VALUES(?, ?, ?, ?, ?, ?)`;
    connection.query(transactionQuery, [user_id, transaction_title, amount, transaction_date, transaction_type, description], (err, result) => {
        if (err) {
            console.error('Error while connecting to database:', err);
            return res.status(500).send('An error occurred while adding the transaction');
        }
        
        // After successful insertion, fetch all transactions and redirect the page
        const getTransactions = `SELECT transaction_title, amount, transaction_date, transaction_type, description FROM transactions WHERE user_id = ? ORDER BY transaction_date DESC`;
        connection.query(getTransactions, [user_id], (err, transactions) => {
            if (err) {
                console.error('Error while getting data from the database:', err);
                return res.status(500).send('An error occurred while fetching transactions');
            }
             // Redirect to GET route with a success message
            res.redirect('/dashboard/transaction?message=Transaction added successfully');
        });
    });
});


// DELETE route
router.delete('/transaction/:id', (req, res) => {
    const transactionId = req.params.id;
    const userId = req.user.id;

    const deleteQuery = `DELETE FROM transactions WHERE id = ? AND user_id = ?`;
    connection.query(deleteQuery, [transactionId, userId], (err, result) => {
        if (err) {
            console.error('Error while deleting transaction:', err);
            return res.status(500).json({ success: false, message: 'An error occurred while deleting the transaction' });
        }

        // Check if any rows were affected (i.e., if a transaction was deleted)
        if (result.affectedRows === 0) {
            return res.status(404).json({ success: false, message: 'Transaction not found' });
        }

        return res.status(200).json({ success: true, message: 'Transaction deleted successfully' });
    });
});

module.exports = router;