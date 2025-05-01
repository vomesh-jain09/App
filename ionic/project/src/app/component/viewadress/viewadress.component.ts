import { Component, EventEmitter, Input, Output, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { FormsModule } from '@angular/forms';
import { HttpClient, HttpClientModule } from '@angular/common/http'; // ✅ Import HTTP

@Component({
  selector: 'app-viewadress',
  standalone: true,
  templateUrl: './viewadress.component.html',
  styleUrls: ['./viewadress.component.scss'],
  imports: [IonicModule, CommonModule, FormsModule, HttpClientModule]
})
export class ViewadressComponent implements OnInit {
  @Input() addresses: any[] = [];
  @Output() close = new EventEmitter<any>();

  selectedAddress: any = null;
  private http = inject(HttpClient); // ✅ Inject HttpClient

  ngOnInit() {
    this.loadAddresses(); // 🔁 Fetch from backend on init
  }

  loadAddresses() {
    this.http.get<any[]>('http://localhost:5000/Address/get').subscribe({
      next: (res) => {
        this.addresses = res;
      },
      error: (err) => {
        console.error('Failed to fetch addresses', err);
      }
    });
  }

  dismiss(data?: any) {
    this.close.emit(data);
  }
}
