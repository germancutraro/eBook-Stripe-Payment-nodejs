const express = require('express');
const keys = require('./config/keys');
const stripe = require('stripe')(stripeSecretKey);
const bodyParser = require('body-parser');

const app = express();

const port = process.env.PORT || 3000;

console.log(`Public: ${keys.stripePublishableKey}`);
console.log(`Secret: ${keys.stripeSecretKey}`);

// Middlewares
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
// ejs engine
app.set('view engine', 'ejs');
// Static
app.use('/public', express.static('public'));

// Routes
app.get('/', (req, res) => {
  res.render('index', {stripePublishableKey});
});

app.post('/charge', (req, res) => {
  const amount = 2500;
  stripe.customers.create({
    email: req.body.stripeEmail,
    source:  req.body.stripeToken
  }).then(customer => stripe.charges.create({
    amount,
    description: 'Web development ebook',
    currency: 'usd',
    customer: customer.id
  })).then(charge => res.render('success'));
});

app.listen(port, err => {
  console.log(err ? `Error on port ${port}` : `App running on port ${port}`);
});
