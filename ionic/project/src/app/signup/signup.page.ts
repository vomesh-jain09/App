import { Component, OnInit, ViewChild } from '@angular/core';
import { AlertController, LoadingController } from '@ionic/angular';
import { NgForm } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.page.html',
  styleUrls: ['./signup.page.scss'],
  standalone: false,
})
export class SignupPage implements OnInit {
  @ViewChild('signupForm', { static: false }) signupForm!: NgForm;

  formData = {
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
  };

  loginData = {
    email: '',
    password: '',
  };

  isLoading = false;
  showSignup: boolean = true;

  constructor(
    private alertController: AlertController,
    private http: HttpClient,
    private loadingController: LoadingController,
    private router: Router
  ) {}

  ngOnInit() {}

  async onSubmit() {
    if (!this.signupForm || !this.signupForm.valid) {
      Object.values(this.signupForm.controls).forEach((control) => {
        control.markAsTouched();
      });

      const alert = await this.alertController.create({
        header: 'Validation Error',
        message: 'Please fill out all required fields correctly.',
        buttons: ['OK'],
      });
      await alert.present();
      return;
    }

    if (this.formData.password !== this.formData.confirmPassword) {
      const alert = await this.alertController.create({
        header: 'Error',
        message: 'Passwords do not match.',
        buttons: ['Try Again'],
      });
      await alert.present();
      return;
    }

    this.isLoading = true;

    const payload = {
      name: this.formData.username,
      email: this.formData.email,
      password: this.formData.password,
    };

    this.http.post('http://localhost:5000/signup', payload).subscribe({
      next: async (response: any) => {
        this.isLoading = false;

        const successAlert = await this.alertController.create({
          header: 'Success',
          message: 'Signup successful!',
          buttons: [
            {
              text: 'OK',
              handler: () => {
                this.signupForm.resetForm();
              },
            },
          ],
        });
        await successAlert.present();
      },
      error: async (error) => {
        this.isLoading = false;

        let errorMessage = 'Signup failed. Please try again.';
        if (error.status === 500) {
          errorMessage = 'Bad request. Please check the input data.';
        } else if (error.status === 400) {
          errorMessage = 'Email already exists. Please use a different email.';
        }

        const errorAlert = await this.alertController.create({
          header: 'Error',
          message: errorMessage,
          buttons: ['OK'],
        });
        await errorAlert.present();
      },
    });
  }

  async onSubmitLogin() {
    if (!this.loginData.email || !this.loginData.password) {
      const alert = await this.alertController.create({
        header: 'Validation',
        message: 'Please enter both email and password.',
        buttons: ['OK'],
      });
      await alert.present();
      return;
    }

    this.isLoading = true;

    const payload = {
      email: this.loginData.email,
      password: this.loginData.password,
    };

    this.http.post('http://localhost:5000/login', payload).subscribe({
      next: async (response: any) => {
        this.isLoading = false;

        const successAlert = await this.alertController.create({
          header: 'Success',
          message: 'Login successful!',
          buttons: [
            {
              text: 'OK',
              handler: () => {
                this.router.navigate(['/home']);
              },
            },
          ],
        });
        await successAlert.present();
      },
      error: async (error) => {
        this.isLoading = false;

        const errorAlert = await this.alertController.create({
          header: 'Error',
          message: 'Login failed. Please check your credentials.',
          buttons: ['OK'],
        });
        await errorAlert.present();
      },
    });
  }
}
