import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';

import { IonicModule, IonicRouteStrategy } from '@ionic/angular';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { StripePage } from './stripe-payment/stripe-page/stripe.page';
import { StripePageModule } from './stripe-payment/stripe-page/stripe.page.module';
import { HttpClientModule } from '@angular/common/http';
import { StatusBar } from '@ionic-native/status-bar/ngx';

@NgModule({
  declarations: [AppComponent],
  entryComponents: [StripePage],
  imports: [BrowserModule, IonicModule.forRoot(), AppRoutingModule, StripePageModule, HttpClientModule],
  providers: [StatusBar, { provide: RouteReuseStrategy, useClass: IonicRouteStrategy }],
  bootstrap: [AppComponent],
})
export class AppModule { }
