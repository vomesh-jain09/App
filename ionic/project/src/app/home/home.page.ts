import { Component, OnDestroy, OnInit, inject } from '@angular/core';
import { ServicsService } from './Service/servics.service'; // import service
import { CartService } from './Service/cart.service'; // Import CartService
import { Strings } from 'src/app/enum/strings.enum'; // Import Strings enum
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
  standalone: false,
})
export class HomePage implements OnInit, OnDestroy {
  query!: string;
  GiftItem: any[] = [];  // Declare the GiftItem array
  items: any[] = [];
  totalitems: number = 0;
  currency = Strings.CURRENCY;
  cartsub!: Subscription;
  starsArray = Array(5).fill(0);                                          
  private cartService = inject(CartService); 

  private servicsService = inject(ServicsService);

  ngOnInit() {
    // Subscribe to getAllItems to fetch the items asynchronously
    this.servicsService.getAllItems().subscribe((data) => {
      this.GiftItem = data;  // Assign the fetched data to GiftItem
      this.items = [...this.GiftItem];  // Create a copy of GiftItem to items
    });

    // Get the current cart and update total items
    const currentCart = this.cartService.getModel();
    if (currentCart) {
      this.totalitems = currentCart.totalItems ?? 0;
    }

    // Listen to cartObservable for real-time updates
    this.cartsub = this.cartService.cartObservable.subscribe({
      next: (cart) => {
        this.totalitems = cart ? cart.totalItems : 0;
      },
    });
  }

  onSearchChange(event: any) {
    this.query = event.detail.value.toLowerCase();
    this.querySearch();
  }

  querySearch() {
    if (this.query?.trim()?.length > 0) {
      this.searchItems();
    } else {
      this.items = [...this.GiftItem]; // Reset to original list if query is empty
    }
  }

  searchItems() {
    this.items = this.GiftItem.filter((item) =>
      item.name.toLowerCase().includes(this.query)
    );
  }

  // Update totalitems when an item is added to the cart
  updateCartCount() {
    this.totalitems = this.cartService.getCartCount();
  }

  addToCart(item: any) {
    this.cartService.addQuantity(item);
  }

  ngOnDestroy(): void {
    // Unsubscribe from the cart observable to prevent memory leaks
    if (this.cartsub) this.cartsub.unsubscribe();
  }
}
