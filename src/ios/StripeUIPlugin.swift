import UIKit
import Stripe

@objc(StripeUIPlugin) class StripeUIPlugin : CDVPlugin {
    var paymentSheet: PaymentSheet?
    
    @objc(presentPaymentSheet:)
    func presentPaymentSheet(command: CDVInvokedUrlCommand){
        let publishableKey = (command.argument(at: 0) ?? "") as! String
        let companyName = (command.argument(at: 1) ?? "") as! String
        let paymentIntent = (command.argument(at: 2) ?? "") as! String
        let customer = (command.argument(at: 3) ?? "") as! String
        let ephemeralKey = (command.argument(at: 4) ?? "") as! String
        let appleMerchantId = (command.argument(at: 5) ?? "") as! String
        let appleMerchantCountryCode = (command.argument(at: 6) ?? "") as! String
        
        StripeAPI.defaultPublishableKey = publishableKey
        
        var configuration = PaymentSheet.Configuration()
        if companyName != "" {
            configuration.merchantDisplayName = companyName
        }
        if customer != "" && ephemeralKey != "" {
            configuration.customer = .init(id: customer, ephemeralKeySecret: ephemeralKey)
        }
        if appleMerchantId != "" && appleMerchantCountryCode != "" {
            configuration.applePay = .init(merchantId: appleMerchantId, merchantCountryCode: appleMerchantCountryCode)
        }
        if paymentIntent != "" {
            self.paymentSheet = PaymentSheet(paymentIntentClientSecret: paymentIntent, configuration: configuration)
            paymentSheet?.present(from: self.viewController) { paymentResult in
                switch paymentResult {
                case .completed:
                    let message = ["code": "0", "message": "PAYMENT_COMPLETED"] as [AnyHashable : Any]
                    let pluginResult = CDVPluginResult(status: CDVCommandStatus_OK, messageAs: message)
                    self.commandDelegate.send(pluginResult, callbackId: command.callbackId)
                case .canceled:
                    let message = ["code": "1", "message": "PAYMENT_CANCELED"] as [AnyHashable : Any]
                    let pluginResult = CDVPluginResult(status: CDVCommandStatus_OK, messageAs: message)
                    self.commandDelegate.send(pluginResult, callbackId: command.callbackId)
                case .failed(let error):
                    let message = ["code": "2", "message": "PAYMENT_FAILED", "error":"\(error.localizedDescription)"] as [AnyHashable : Any]
                    let pluginResult = CDVPluginResult(status: CDVCommandStatus_OK, messageAs: message)
                    self.commandDelegate.send(pluginResult, callbackId: command.callbackId)
                }
            }
        } else {
            let message = ["code": "2", "message": "PAYMENT_FAILED", "error":"NO_PAYMENT_INTENT"] as [AnyHashable : Any]
            let pluginResult = CDVPluginResult(status: CDVCommandStatus_OK, messageAs: message)
            self.commandDelegate.send(pluginResult, callbackId: command.callbackId)
        }
    }
}
