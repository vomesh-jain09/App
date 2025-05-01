import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CartService } from '../Service/cart.service';
import { Subscription } from 'rxjs';
import { Strings } from 'src/app/enum/strings.enum';
import { ModalController } from '@ionic/angular';
import { CouponsComponent } from 'src/app/coupons/coupons.component';
import { AddadressComponent } from 'src/app/component/addadress/addadress.component';

@Component({
  selector: 'app-cart',
  templateUrl: './cart.page.html',
  styleUrls: ['./cart.page.scss'],
  standalone: false
})
export class CartPage implements OnInit, OnDestroy {
  previous!: string;
  showAddressModal = false;
  applyCoupon: boolean = false;
  showPaymentSection: boolean = false;  // Flag to show Payment button
  displayPaymentComponent: boolean = false;  // Flag to show Payment Component

  private router = inject(Router);
  public cartservice = inject(CartService);
  private modalController = inject(ModalController);
  model: any = null;
  currency = Strings.CURRENCY;
  selectedCoupon: any = null;
  cartSub!: Subscription;
  address: any = null;

  constructor() {}

  ngOnInit() {
    this.checkUrl();
    this.cartSub = this.cartservice.cartObservable.subscribe({
      next: (cart) => {
        this.model = cart;
        this.updateGrandTotal();
      }
    });
  }

  ngOnDestroy(): void {
    if (this.cartSub) this.cartSub.unsubscribe();
  }

  checkUrl() {
    const route_url = this.router.url;
    const urlParts = route_url.split('/');
    urlParts.pop();
    this.previous = urlParts.join('/');
  }

  addQuantity(item: any) {
    this.cartservice.addQuantity(item);
    this.updateGrandTotal();
  }

  removeQuantity(item: any) {
    this.cartservice.removeQuantity(item);
    this.updateGrandTotal();
  }

  async openCouponModal() {
    const modal = await this.modalController.create({
      component: CouponsComponent,
      componentProps: { orderTotal: this.model?.grandTotal }
    });

    await modal.present();

    const { data, role } = await modal.onWillDismiss();
    if (role === 'selected' && data?.coupon) {
      this.selectedCoupon = data.coupon;
      this.updateGrandTotal();
    }
  }

  updateGrandTotal() {
    if (this.model) {
      const { totalPrice, total_delivery_charge, tax } = this.model;
      let grandTotal = totalPrice + total_delivery_charge + tax;

      if (this.selectedCoupon) {
        const minAmount = this.selectedCoupon.minAmount || 0;

        if (grandTotal >= minAmount) {
          const discount = this.getCouponDiscount();
          grandTotal -= discount;
        } else {
          this.selectedCoupon = null;
        }
      }

      this.model.grandTotal = grandTotal;
    }
  }

  getCouponDiscount() {
    if (this.selectedCoupon) {
      if (this.selectedCoupon.isPercentage) {
        return (this.model?.totalPrice * (this.selectedCoupon.saved || 0)) / 100;
      } else {
        return this.selectedCoupon.saved || 0;
      }
    }
    return 0;
  }

  removeCoupon() {
    this.selectedCoupon = null;
    this.updateGrandTotal();
  }

  trackById(index: number, item: any): any {
    return item.item_id;
  }

  // Checkout method with address logic
  async checkout() {
    if (!this.address) {
      const modal = await this.modalController.create({
        component: AddadressComponent
      });

      await modal.present();

      const { data } = await modal.onDidDismiss();

      if (data) {
        this.address = data;
        console.log('Address saved and added to cart:', this.address);
        this.showPaymentSection = true;  // Show Payment section after adding address
      } else {
        console.log('Address modal dismissed without saving');
      }
    } else {
      console.log('Proceeding with checkout using saved address:', this.address);
      this.showPaymentSection = true;  // Show Payment section if address exists
    }
  }

  // Method for selecting the coupon
  selectCoupon(coupon: any) {
    this.selectedCoupon = coupon;
    this.updateGrandTotal();
  }

  // Open modal for editing address
  async openEditAddressModal() {
    const modal = await this.modalController.create({
      component: AddadressComponent,
      componentProps: {
        existingAddress: this.address  
      }
    });

    await modal.present();

    const { data } = await modal.onDidDismiss();

    if (data) {
      this.address = data;  
      console.log('Address updated:', this.address);
    } else {
      console.log('Edit address modal dismissed without changes');
    }
  }

  // Update address and close the modal
  updateAddress(updatedAddress: any) {
    this.address = updatedAddress;
    this.showAddressModal = false;
  }

  // Open payment section after address is added
  openPayment() {
    this.displayPaymentComponent = true;  // Display the payment component
  }
}
