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