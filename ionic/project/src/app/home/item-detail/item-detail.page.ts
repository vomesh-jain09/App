import { Component, OnDestroy, OnInit, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NavController, ToastController } from '@ionic/angular';
import { ServicsService } from '../Service/servics.service';
import { CartService } from '../Service/cart.service';
import { Strings } from 'src/app/enum/strings.enum';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-item-detail',
  templateUrl: './item-detail.page.html',
  styleUrls: ['./item-detail.page.scss'],
  standalone: false,
})
export class ItemDetailPage implements OnInit, OnDestroy {
  id!: string;
  item: any;
  addToBag: string | null = null;
  totalItems = 0;
  currency = Strings.CURRENCY;
  cartSub!: Subscription;
  starsArray = Array(5).fill(0);

  private route = inject(ActivatedRoute);
  private navCtrl = inject(NavController);
  private toastController = inject(ToastController);
  private servicsService = inject(ServicsService);
  private cartService = inject(CartService);

  ngOnInit() {
    this.getItem(); // Fetch item details by ID

    // Subscribe to cart updates to always reflect the correct count
    this.cartSub = this.cartService.cartObservable.subscribe({
      next: (cart) => {
        this.totalItems = cart ? cart.totalItems : 0;
      },
    });
  }

  // Fetch item by ID from route parameters
  getItem() {
    const id = this.route.snapshot.paramMap.get('id');
    if (!id || id === '0') {
      this.navCtrl.back(); // Go back if ID is missing or invalid
      return;
    }

    this.id = id;
    // Subscribe to the service call to get item details
    this.servicsService.getItemById(id).subscribe({
      next: (item) => {
        this.item = item;
      },
      error: () => {
        this.navCtrl.back(); // Go back if item is not found or error occurs
      }
    });
  }

  // Add item to the cart
  async additem() {
    if (!this.item?.id) {
      return; // Do nothing if item ID is missing
    }

    // Check if the item is already in the cart
    const existingItem = this.cartService.getCartItems().find((i: { id: string }) => i.id === this.item.id);

    if (existingItem) {
      // If the item exists, increase the quantity
      this.cartService.addQuantity(existingItem);
    } else {
      // If the item is not found, add it with quantity = 1
      const newItem = { ...this.item, quantity: 1 };
      this.cartService.addToCart(newItem);  // Ensure addToCart is a valid method
    }

    this.addedText(); // Show "Added to Bag" message
  }

  // Show "Added to Bag" message for 1 second
  addedText() {
    this.addToBag = 'Added to Bag';
    setTimeout(() => {
      this.addToBag = null;
    }, 1000);
  }

  // Get the count of items in the cart
  get cartCount(): number {
    return this.totalItems;
  }

  // Clean up the subscription when component is destroyed
  ngOnDestroy(): void {
    if (this.cartSub) {
      this.cartSub.unsubscribe();
    }
  }
}
