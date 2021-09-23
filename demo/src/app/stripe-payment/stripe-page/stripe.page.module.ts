import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { StripePage } from './stripe.page';
import { StripePageRoutingModule } from './stripe-routing.module';
import { StripePaymentService } from '../service/stripe-payment.service';
@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    IonicModule,
    StripePageRoutingModule
  ],
  providers: [
    StripePaymentService
  ],
  declarations: [StripePage]
})
export class StripePageModule { }