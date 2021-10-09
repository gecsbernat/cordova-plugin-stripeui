import * as functions from 'firebase-functions';
import Stripe from 'stripe';

const SK = 'sk_test_...';
const PK = 'pk_test_...';
const COMPANY_NAME = 'ACME';
const APPLE_MERCHANT_ID = 'com.example.myapp';
const APPLE_MERCHANT_COUNTRYCODE = 'US';
const stripe = new Stripe(SK, { apiVersion: '2020-08-27' });

export const payment = functions.https.onRequest(async (request, response) => {
    response.set('Access-Control-Allow-Origin', '*');
    if (request.method === 'OPTIONS') {
        response.set('Access-Control-Allow-Methods', 'GET');
        response.set('Access-Control-Allow-Headers', 'content-type');
        response.set('Access-Control-Max-Age', '3600');
        response.status(204).send('');
    } else if (request.method === 'POST') {
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
                paymentIntent: paymentIntent.client_secret,
                customerId: customer.id,
                ephemeralKey: ephemeralKey.secret,
                appleMerchantId: APPLE_MERCHANT_ID,
                appleMerchantCountryCode: APPLE_MERCHANT_COUNTRYCODE
            });
        } catch (error) {
            error = JSON.stringify(error);
            functions.logger.error(error);
            response.status(500).send(error);
        }
    } else {
        response.status(200).send('<p> Works fine! </p>');
    }
});