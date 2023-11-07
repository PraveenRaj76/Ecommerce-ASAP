import { Component, OnInit } from '@angular/core';
import {CartService} from "../../services/cart.service";
import {Router} from "@angular/router";
import {NgxSpinnerService} from "ngx-spinner";
import {CartModelServer} from "../../models/cart.model";
import {OrderService} from "../../services/order.service";
import {AuthService} from "../../services/auth.service";
import {AddressService} from "../../services/address.service";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";

@Component({
  selector: 'app-checkout',
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.scss']
})
export class CheckoutComponent implements OnInit {

  cartData!: CartModelServer;
  cartTotal!: number;
  userId!: number;
  user: any;
  address: any;
  addressForm: FormGroup;
  addressMessage!: string;
  addressState!: boolean;
  checkoutState = false;

  private namePattern = /^[a-zA-Z][a-zA-Z\s]+$/;

  constructor(private cartService: CartService,
              private orderService: OrderService,
              private router: Router,
              private  spinner: NgxSpinnerService,
              private authService: AuthService,
              private addressService: AddressService,
              private fb: FormBuilder) {

    this.addressForm = fb.group({
      address: ['', [Validators.required, Validators.minLength(6), Validators.maxLength(30)]],
      city: ['', [Validators.required, Validators.minLength(3), Validators.pattern(this.namePattern)]],
      state: ['', [Validators.required, Validators.minLength(3), Validators.pattern(this.namePattern)]],
      country: ['',[Validators.required, Validators.minLength(3), Validators.pattern(this.namePattern)]],
      pincode: ['', [ Validators.required, Validators.min(100000), Validators.max(999999)]],
      phone: ['', [Validators.required, Validators.min(6000000000), Validators.max(9999999999), Validators.minLength(10)]]
    })

  }

  get formControls() {
    return this.addressForm.controls;
  }

  ngOnInit(): void {
    this.cartService.cartData$.subscribe(data => this.cartData = data);
    this.cartService.cartTotal$.subscribe(total => this.cartTotal = total);
    this.authService.userData$.subscribe(data => {
      // @ts-ignore
      this.userId = data.id || data.userId;
      this.user = data;
    });
    this.addressService.getSingleAddress(this.userId).subscribe( data => {
      if(typeof(data) !== null) {
        // @ts-ignore
        if(typeof(data.message) === 'string') {
          this.addressState = true;
        } else {
          this.addressState = false;
          // @ts-ignore
          this.address = data[0];
          this.checkoutState = true;
        }
      }
    })
  }


  newAddress() {

    if(this.addressForm.invalid) {
      return;
    }

    this.addressService.newAddress(this.userId,{...this.addressForm.value}).subscribe((response: { message : string}) => {
      this.addressMessage = response.message;
      this.addressState = true;
      setTimeout(() => {
        this.addressMessage = '';
      }, 5000);
    });

  }

  onCheckout() {
    if (this.cartTotal > 0) {
      this.spinner.show().then(p => {
        this.cartService.CheckoutFromCart(this.userId);
      });
    } else {
      return;
    }
  }


}
