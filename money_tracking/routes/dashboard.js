const express = require('express');
const router = express.Router();
const connection = require('./db_config');
const { authenticateToken } = require('./login');

router.use(authenticateToken);

router.get('/', (req, res) => {
  const user_id = req.user.id;
  console.log('User ID:', user_id);

  const getDashboardData = `
    SELECT transaction_type, DATE(transaction_date) as date, SUM(amount) as daily_amount
    FROM transactions
    WHERE user_id = ?
    GROUP BY transaction_type, DATE(transaction_date)
    ORDER BY DATE(transaction_date)
  `;

  const getCardQuery = `
    SELECT card_type, card_amount, card_number, DATE_FORMAT(expiry_date, '%m/%y') AS expiry_date
    FROM cards
    WHERE user_id = ?
  `;

  // Use Promise.all to run both queries concurrently
  Promise.all([
    new Promise((resolve, reject) => {
      connection.query(getDashboardData, [user_id], (err, result) => {
        if (err) {
          console.error('Error fetching dashboard data:', err);
          reject(err);
        } else {
          resolve(result);
        }
      });
    }),
    new Promise((resolve, reject) => {
      connection.query(getCardQuery, [user_id], (err, result) => {
        if (err) {
          console.error('Error while fetching card details:', err);
          reject(err);
        } else {
          resolve(result);
        }
      });
    })
  ])
    .then(([dashboardResult, cardResult]) => {
      console.log('Raw dashboard data:', dashboardResult);
      const processedData = processData(dashboardResult);
      console.log('Processed dashboard data:', processedData);

      const card = cardResult.length > 0 ? cardResult[0] : null;

      res.render('dashboard', {
        dashboardData: processedData,
        card: card,
        users: req.user
      });
    })
    .catch(error => {
      res.status(500).send('An error occurred while fetching data');
    });
});

function processData(rawData) {
  let total_income = 0;
  let total_expense = 0;
  const dateMap = new Map();

  rawData.forEach(row => {
    const date = row.date.toISOString().split('T')[0];
    if (!dateMap.has(date)) {
      dateMap.set(date, { income: 0, expense: 0 });
    }
    if (row.transaction_type === 'income') {
      const amount = Number(row.daily_amount);
      dateMap.get(date).income += amount;
      total_income += amount;
    } else if (row.transaction_type === 'expense') {
      const amount = Number(row.daily_amount);
      dateMap.get(date).expense += amount;
      total_expense += amount;
    }
  });

  const sortedDates = Array.from(dateMap.keys()).sort();

  return {
    total_income: total_income,
    total_expense: total_expense,
    balance: total_income - total_expense,
    chartData: {
      labels: sortedDates,
      income: sortedDates.map(date => dateMap.get(date).income),
      expense: sortedDates.map(date => dateMap.get(date).expense)
    }
  };
}

module.exports = router;