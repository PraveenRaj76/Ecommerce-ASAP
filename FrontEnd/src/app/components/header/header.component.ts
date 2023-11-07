import { Component, OnInit } from '@angular/core';
import {Router} from "@angular/router";
import {AuthService} from "../../services/auth.service";
import {CartService} from "../../services/cart.service";
import {CartModelServer} from "../../models/cart.model";

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {

  cartData!: CartModelServer;
  cartTotal!: number;
  authState!: boolean;

  constructor(public cartService: CartService,
              private authService: AuthService,
              private router: Router) {
  }

  ngOnInit(): void {
    this.cartService.cartTotal$.subscribe(total => this.cartTotal = total);

    this.cartService.cartData$.subscribe(data => this.cartData = data);

    this.authService.authState$.subscribe(authState => this.authState = authState);
  }

  selectCategory(catName: string) {
    this.router.navigate([`/category`, catName]).then();
  }

}
