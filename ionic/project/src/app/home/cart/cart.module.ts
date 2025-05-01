import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { CartPageRoutingModule } from './cart-routing.module';

import { CartPage } from './cart.page';
import {CouponsComponent} from'src/app/coupons/coupons.component'
import { ViewadressComponent } from 'src/app/component/viewadress/viewadress.component';
import { AddadressComponent } from 'src/app/component/addadress/addadress.component';
import { PaymentComponent } from 'src/app/component/payment/payment.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    CartPageRoutingModule,
    CouponsComponent,
    ViewadressComponent,
    AddadressComponent,
    PaymentComponent
  ],
  declarations: [CartPage]
})
export class CartPageModule {}
