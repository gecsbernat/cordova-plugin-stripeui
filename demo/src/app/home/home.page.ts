import { Component } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { StripePage } from '../stripe-payment/stripe-page/stripe.page';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {

  constructor(
    private modalController: ModalController
  ) { }

  pay() {
    const items = [
      {
        name: 'Item 1',
        price: 100
      },
      {
        name: 'Item 2',
        price: 100
      },
      {
        name: 'Item 3',
        price: 100
      }
    ];
    this.openPayment(items, 'USD');
  }

  async openPayment(items: any[], currency: string) {
    const modal = await this.modalController.create({
      component: StripePage,
      backdropDismiss: false,
      componentProps: {
        items: items,
        currency: currency,
        customerId: null,
        customerEmail: null,
        customerName: null
      }
    });
    modal.onDidDismiss().then((data) => {
      console.log(data);
    });
    await modal.present();
  }

}
