import { Component, EventEmitter, Input, Output, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule, ModalController, NavController } from '@ionic/angular';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-addadress',
  templateUrl: './addadress.component.html',
  styleUrls: ['./addadress.component.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule],
})
export class AddadressComponent implements OnInit {
  @Input() existingAddress: any; // ✅ receive address to update
  @Output() addressSaved = new EventEmitter<any>();
  @Output() close = new EventEmitter<void>();

  address = {
    fullName: '',
    phone: '',
    house: '',
    street: '',
    city: '',
    state: '',
    pincode: ''
  };

  constructor(private modalCtrl: ModalController, private navCtrl: NavController) {}

  ngOnInit() {
    // ✅ Autofill form if editing existing address
    if (this.existingAddress) {
      this.address = { ...this.existingAddress };
      console.log('Loaded existing address:', this.address);
    }
  }

  save() {
    if (this.isAddressValid()) {
      console.log('Address saved:', this.address);
      this.modalCtrl.dismiss(this.address);  // Return address to parent
    } else {
      console.log('Form is incomplete');
    }
  }

  dismiss() {
    this.close.emit();
    this.modalCtrl.dismiss();  // Just close modal
  }

  private isAddressValid(): boolean {
    const values = Object.values(this.address);
    return values.every(value =>
      value !== null &&
      value !== undefined &&
      String(value).trim() !== ''
    );
  }
}
