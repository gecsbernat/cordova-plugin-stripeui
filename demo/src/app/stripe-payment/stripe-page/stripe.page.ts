import { Component, Input, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { StripePaymentService } from '../service/stripe-payment.service';

@Component({
  selector: 'app-stripe',
  templateUrl: './stripe.page.html',
  styleUrls: ['./stripe.page.scss'],
})
export class StripePage implements OnInit {

  @Input() items: any[] = null;
  @Input() currency: string = null;
  @Input() customerId: string = null;
  @Input() customerEmail: string = null;
  @Input() customerName: string = null;
  amount: number = null;
  loading = false;

  constructor(
    private modalController: ModalController,
    private stripeService: StripePaymentService
  ) { }

  ngOnInit() {
    if (!this.currency || !this.items) {
      this.dismiss(null);
    }
    this.amount = 0;
    this.items.forEach((i) => {
      this.amount += i.price;
    });
  }

  async payment() {
    try {
      this.loading = true;
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
        this.dismiss(true);
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
    console.log({ paymentIntent, customer });
  }

  async dismiss(data: any = null) {
    this.modalController.dismiss(data);
  }

}
