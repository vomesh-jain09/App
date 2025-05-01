import { inject, Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { StorageService } from './storage.service';
import { Strings } from 'src/app/enum/strings.enum';

@Injectable({
  providedIn: 'root',
})
export class CartService {
  getCartTotal() {
    throw new Error('Method not implemented.');
  }
  model: any = {
    items: [],
    totalItems: 0,
    totalPrice: 0,
    grandTotal: 0,
    tax: 0,
    total_delivery_charge: 100,
  };

  total_delivery_charge = 100;
  tax = 5;
  selectedCoupon: any = null; // Added selectedCoupon to store the selected coupon

  private cart$ = new BehaviorSubject<any>(this.model);
  private storage = inject(StorageService);
  cartStoreName = Strings.CART_STORAGE;

  get cartObservable() {
    return this.cart$.asObservable();
  }

  constructor() {
    this.initCart();
  }

  private async initCart() {
    await this.getCart();
    if (!this.model) {
      this.model = {
        items: [],
        totalItems: 0,
        totalPrice: 0,
        grandTotal: 0,
        tax: 0,
        total_delivery_charge: this.total_delivery_charge,
      };
    }
    this.cart$.next(this.model);
  }

  updateCart(cartData: any) {
    this.cart$.next(cartData);
  }

  getCartItems() {
    return this.model.items || [];
  }

  addToCart(item: any) {
    if (!this.model) {
      this.model = { items: [] };
    }
    this.model.items.push(item);
    this.calculate();
  }

  addQuantity(item: any) {
    if (!this.model) {
      this.model = { items: [] };
    }
    const index = this.model.items.findIndex((data: any) => data.id === item.id);

    if (index >= 0) {
      this.model.items[index].quantity += 1;
    } else {
      this.model.items.push(item);
    }

    this.calculate();
  }

  removeQuantity(item: any) {
    const index = this.model.items.findIndex((data: any) => data.id === item.id);

    if (index >= 0) {
      if (this.model.items[index].quantity > 1) {
        this.model.items[index].quantity -= 1;
      } else {
        this.model.items.splice(index, 1);
      }
    }

    this.calculate();
  }

  calculate() {
    const items = this.model.items.filter((item: any) => item.quantity > 0);

    if (!items.length) {
      this.clearCart();
      this.cart$.next(this.model);
      return;
    }

    let totalItems = 0;
    let totalPrice = 0;

    items.forEach((item: any) => {
      totalItems += item.quantity;
      totalPrice += item.price * item.quantity;
    });

    const deliveryCharge = totalPrice >= 5000 ? 0 : this.total_delivery_charge;
    const taxAmount = (this.tax / 100) * totalPrice;
    const grandTotal = totalPrice + deliveryCharge + taxAmount;

    this.model = {
      ...this.model,
      items,
      totalItems,
      totalPrice,
      total_delivery_charge: deliveryCharge,
      tax: taxAmount,
      grandTotal,
    };

    this.updateCart(this.model);
    this.saveCart(this.model);
  }

  async saveCart(data: any) {
    const model = JSON.stringify(data);
    await this.storage.setStorage(this.cartStoreName, model);
  }

  async getCart() {
    const data: any = await this.storage.getStorage(this.cartStoreName);
    if (data?.value) {
      this.model = JSON.parse(data.value);
      this.updateCart(this.model);
    }
  }

  async clearCart() {
    await this.storage.removeStorage(this.cartStoreName);
    this.model = { items: [] };
    this.cart$.next(this.model);
  }

  getModel() {
    return this.model;
  }

  getCartCount() {
    return this.model?.totalItems || 0;
  }

  // New method to set selected coupon
  setSelectedCoupon(coupon: any) {
    this.selectedCoupon = coupon;
    this.calculate();  // Recalculate the grand total with the selected coupon
  }

  // Method to get the selected coupon
  getSelectedCoupon() {
    return this.selectedCoupon;
  }
}
