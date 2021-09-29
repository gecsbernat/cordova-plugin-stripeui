var exec = require('cordova/exec');
module.exports = {
	presentPaymentSheet: function (publishableKey, companyName, paymentIntent, customer, ephemeralKey, appleMerchantId, appleMerchantCountryCode, success, error) {
		exec(success, error, "StripeUIPlugin", "presentPaymentSheet", [publishableKey, companyName, paymentIntent, customer, ephemeralKey, appleMerchantId, appleMerchantCountryCode]);
	}
};