# cordova-plugin-stripeui
Cordova plugin for Stripe Prebuilt UI on [Android](https://stripe.com/docs/payments/accept-a-payment?platform=android) and [iOS](https://stripe.com/docs/payments/accept-a-payment?platform=ios)

## Demo project
 --> [Ionic5/Cordova](https://github.com/gecsbernat/cordova-plugin-stripeui-demo) <--

## Features

- It uses the [Stripe Android SDK](https://github.com/stripe/stripe-android) and [Stripe iOS SDK](https://github.com/stripe/stripe-ios) single step UI.
- Sample backend code in the server folder (NodeJS & Cloud Function).
- Creates Stripe Customer from input.
- Accept payment.
- Apple Pay support.

## Installation
```sh
ionic cordova plugin add https://github.com/gecsbernat/cordova-plugin-stripeui.git
```

## Requirements
- Stripe account.
- Secret key and Publishable key (See server folder).
- Apple Merchant ID and Apple Merchant Country Code [for Apple Pay](https://stripe.com/docs/payments/accept-a-payment?platform=ios&ui=payment-sheet#apple-pay).

## Backend
- You should host the backend code on your server or in a firebase cloud function (See server folder).

## Usage

- Sample typescript service code:
```typescript
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Platform } from '@ionic/angular';

declare const StripeUIPlugin: any;

@Injectable({ providedIn: 'root' })
export class StripePaymentService {

    private isCordova: boolean;
    private SERVER_URL = 'YOUR_BACKEND_URL/payment';

    constructor(
        private platform: Platform,
        private http: HttpClient
    ) {
        this.platform.ready().then(async () => {
            this.isCordova = this.platform.is('cordova');
        });
    }

    makePayment(amount: number, currency: string, customerId: string = null, customerEmail: string = null, customerName: string = null): Promise<{ result: { code: string, message: string, error: string }, paymentIntent: string, customer: string }> {
        return new Promise((resolve, reject) => {
            if (this.isCordova) {
                const body = {
                    amount: amount,
                    currency: currency,
                    customerId: customerId,
                    customerEmail: customerEmail,
                    customerName: customerName
                };
                const subscribe = this.http.post(this.SERVER_URL, body).subscribe((result: any) => {
                    const publishableKey = result.publishableKey;
                    const companyName = result.companyName;
                    const paymentIntent = result.paymentIntent;
                    const customer = result.customer
                    const ephemeralKey = result.ephemeralKey;
                    const appleMerchantId = result.appleMerchantId;
                    const appleMerchantCountryCode = result.appleMerchantCountryCode;
                    this.presentPaymentSheet(publishableKey, companyName, paymentIntent, customer, ephemeralKey, appleMerchantId, appleMerchantCountryCode).then((result) => {
                        resolve({ result, paymentIntent, customer });
                    }).catch((error) => {
                        reject(error);
                    });
                    subscribe.unsubscribe(); return;
                }, (error) => {
                    reject(error);
                    subscribe.unsubscribe(); return;
                });
            } else {
                reject('NOT_CORDOVA'); return;
            }
        });
    }

    private presentPaymentSheet(publishableKey: string, companyName: string, paymentIntent: string, customer: string, ephemeralKey: string, appleMerchantId: string, appleMerchantCountryCode: string): Promise<any> {
        return new Promise((resolve, reject) => {
            if (this.isCordova) {
                StripeUIPlugin.presentPaymentSheet(publishableKey, companyName, paymentIntent, customer, ephemeralKey, appleMerchantId, appleMerchantCountryCode, (success: any) => {
                    try {
                        const result = JSON.parse(success) as any;
                        resolve(result);
                    } catch (unused) {
                        resolve(success);
                    }
                    return;
                }, (error: any) => {
                    reject(error); return;
                });
            } else {
                reject('NOT_CORDOVA'); return;
            }
        });
    }

}
```

- In your payment page:
```typescript
....
  async payment() {
    try {
      this.loading = true;
      // customerId, customerEmail, customerName can be null.
      // customerId should be your saved customer from prevoius payment.
      const payment = await this.stripeService.makePayment(this.amount, this.currency, this.customerId, this.customerEmail, this.customerName);
      const paymentIntent = payment.paymentIntent;
      const customer = payment.customer;
      const result = payment.result;
      const code = result.code ? Number(result.code) : -1;
      const message = result.message || null;
      const error = result.error || null;
      console.log({ paymentIntent, customer, code, message, error });
      this.loading = false;
      if (code === 0) {
        // PAYMENT_COMPLETED
        this.savePayment(paymentIntent, customer);
      } else if (code === 1) {
        // PAYMENT_CANCELED
      } else if (code === 2) {
        // PAYMENT_FAILED
      }
    } catch (error) {
      this.loading = false;
      console.log(error);
    }
  }

  savePayment(paymentIntent: string, customer: string) {
    // TODO: save the payment and customer in your database for later use...
  }
  ....
```
