import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class AddressService {
  private address: any = null;

  constructor() {
    // Optional: load from localStorage
    const saved = localStorage.getItem('user_address');
    if (saved) this.address = JSON.parse(saved);
  }

  getAddress() {
    return this.address;
  }

  saveAddress(addr: any) {
    this.address = addr;
    localStorage.setItem('user_address', JSON.stringify(addr));
  }
}
