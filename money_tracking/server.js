const express = require('express');
const ejs = require('ejs');
const path = require('path');
const bodyParser = require('body-parser')
const newsletterRoute = require('./routes/newsletters');
const registerRouter = require('./routes/register');
const { router: loginRouter } = require('./routes/login');
const dashboardRouter = require('./routes/dashboard');
const transactionRouter = require('./routes/transaction')
const cardRouter = require('./routes/card')
const logoutRouter = require('./routes/logout');

const app = express();
const port = process.env.port || 3000;

// Middleware
app.set('view engine', 'ejs');
app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.urlencoded({ extended: false }));

//routes
app.use('/', newsletterRoute);
app.use('/', registerRouter);
app.use('/', loginRouter);
app.use('/dashboard', dashboardRouter);
app.use('/dashboard', transactionRouter);
app.use('/dashboard', cardRouter);
app.use('/', logoutRouter);

app.get('/', (req, res)=>{
    res.render('index')
})

app.listen(port, ()=>{
    console.log('Server is running on port: ', port);
});