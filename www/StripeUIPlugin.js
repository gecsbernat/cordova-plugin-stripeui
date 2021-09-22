var exec = require('cordova/exec');
module.exports = {
	presentPaymentSheet: function (publishableKey, companyName, appleMerchantId, paymentIntent, customer, ephemeralKey, success, error) {
		exec(success, error, "StripeUIPlugin", "presentPaymentSheet", [publishableKey, companyName, appleMerchantId, paymentIntent, customer, ephemeralKey]);
	}
};