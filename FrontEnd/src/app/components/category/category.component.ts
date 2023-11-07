import { Component, OnInit } from '@angular/core';
import {ProductService} from "../../services/product.service";
import {ActivatedRoute, ParamMap, Router} from "@angular/router";
import {CartService} from "../../services/cart.service";
import {ProductModelServer, ServerResponse} from "../../models/product.model";
import {map} from "rxjs";

@Component({
  selector: 'app-category',
  templateUrl: './category.component.html',
  styleUrls: ['./category.component.scss']
})
export class CategoryComponent implements OnInit {

  // @ts-ignore
  catName: string;
  products: ProductModelServer[] = [];

  constructor(private productService: ProductService,
              private router: Router,
              private cartService: CartService,
              private route: ActivatedRoute) { }

  ngOnInit(): void {
    this.route.paramMap.pipe(
      map((param: ParamMap) => {
        // @ts-ignore
        return param.params.catName;
      })
    ).subscribe( prodcatName => {
      this.catName = prodcatName;
      // @ts-ignore
      this.productService.getProductsFromCategory(this.catName).subscribe((prods: ServerResponse) => {
        this.products = prods.products;
      });
    });
  }

  selectProduct(id: number) {
    this.router.navigate([`/product`, id]).then();
  }

  AddToCart(id: number) {
    this.cartService.AddProductToCart(id);
  }

}
