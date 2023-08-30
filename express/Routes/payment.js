const client = require("../..");
const { Auth } = require("../Middlewares");
const api = require("express").Router();
const stripe = require('stripe')(client.config.stripe.token);

api.get('/', Auth, async (req, res) => {
    try {
        const session = await stripe.checkout.sessions.create({
            payment_method_types: ['card'],
            line_items: [{
                price_data: {
                    currency: 'inr',
                    product_data: {
                        name: `plan 1`
                    },
                    unit_amount: 1000
                },
                quantity: 1
            }],
            mode: 'payment',
            success_url: 'http://localhost:6969/api/payment/success?session_id={CHECKOUT_SESSION_ID}',
            cancel_url: 'http://localhost:6969/api/payment/cancel'
        });

        res.redirect(session.url);
    } catch (e) {
        // Handle error
        console.error(e);
        res.status(500).json({ error: e.message });
    }
});

api.get('/success', async (req, res) => {
    console.log(req.query);

    try {
        const session = await stripe.checkout.sessions.retrieve(req.query.session_id);

        // Only retrieve customer information if the session has a customer property
        let customerInfo = null;
        if (session.customer) {
            customerInfo = await stripe.customers.retrieve(session.customer);
        }

        // You can use the retrieved data to update your database, send email notifications, etc.

        // Display a message to the user
        res.send({ session: session, customer: customerInfo });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: error.message });
    }
});



api.get('/cancel', (req, res) => {
    // Handle cancellation
    res.send('Payment canceled.');
});

module.exports = api;