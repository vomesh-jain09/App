import { Component, Input, OnInit } from '@angular/core';
import { ModalController, NavController, IonicModule } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';  // Import HttpClient to make API calls

@Component({
  selector: 'app-coupons',
  templateUrl: './coupons.component.html',
  styleUrls: ['./coupons.component.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule]
})
export class CouponsComponent implements OnInit {
  @Input() orderTotal: number | undefined;
  @Input() grandTotal: number | undefined;

  coupons: any[] = [];  // Initialize an empty array for coupons
  loading: boolean = false;  // To show a loading spinner if needed
  errorMessage: string | null = null;  // For error handling

  constructor(
    private navController: NavController,
    private modalCtrl: ModalController,
    private http: HttpClient  // Inject HttpClient
  ) {}

  ngOnInit() {
    this.loadCoupons();
  }

  // Fetch coupons from the API
  loadCoupons() {
    this.loading = true;
    this.http.get<any[]>('http://localhost:5000/Coupons/get').subscribe({
      next: (coupons) => {
        this.coupons = coupons;  // Set the coupons array with the API response
        this.loading = false;
      },
      error: (error) => {
        this.errorMessage = 'Failed to load coupons. Please try again later.';
        this.loading = false;
      }
    });
  }

  // Apply coupon logic
  applyCoupon(coupon: any) {
    const baseAmount = this.grandTotal ?? this.orderTotal;

    if (baseAmount && baseAmount >= coupon.minAmount) {
      let discountAmount = 0;

      if (coupon.isPercentage) {
        discountAmount = (baseAmount * coupon.saved) / 100;
      } else {
        discountAmount = coupon.saved;
      }

      const finalAmount = baseAmount - discountAmount;
      this.modalCtrl.dismiss({ coupon, finalAmount }, 'selected');
    } else {
      alert(`This coupon requires a minimum order of ₹${coupon.minAmount}.`);
    }
  }

  cancel() {
    this.modalCtrl.dismiss(null, 'cancelled');
  }
}
