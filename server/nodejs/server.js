const PORT = 3000;
const SK = 'sk_test_...';
const PK = 'pk_test_...';
const COMPANY_NAME = 'COMPANY_NAME';
const APPLE_MERCHANT_ID = 'APPLE_MERCHANT_ID';
const cors = require("cors");
const express = require("express");
const app = express();
const stripe = require("stripe")(SK);
app.use(express.static("."));
app.use(express.json());
app.use(cors({ origin: '*' }));
app.post("/payment", async (request, response) => {
    try {
        const body = request.body;
        const amount = body.amount || 0;
        const currency = body.currency || 'USD';
        const customerId = body.customerId || null;
        const customerEmail = body.customerEmail || null;
        const customerName = body.customerName || null;
        let customer = null;
        if (customerId) {
            customer = { id: customerId };
        } else {
            customer = await stripe.customers.create({
                email: customerEmail,
                name: customerName
            });
        }
        const ephemeralKey = await stripe.ephemeralKeys.create(
            { customer: customer.id },
            { apiVersion: '2020-08-27' }
        );
        const paymentIntent = await stripe.paymentIntents.create({
            amount: amount,
            currency: currency,
            customer: customer.id
        });
        response.status(200).send({
            publishableKey: PK,
            companyName: COMPANY_NAME,
            appleMerchantId: APPLE_MERCHANT_ID,
            paymentIntent: paymentIntent.client_secret,
            customer: customer.id,
            ephemeralKey: ephemeralKey.secret
        });
    } catch (error) {
        error = JSON.stringify(error);
        response.status(500).send(error);
    }
});
app.get('/', (req, res) => {
    res.send('<p> Works fine! </p>');
});
app.listen(PORT, () =>
    console.log(`Node server listening on port ${PORT}!`)
);