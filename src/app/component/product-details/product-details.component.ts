import { CartService } from './../../services/cart.service';
import { ProductService } from 'src/app/services/product.service';
import { Product } from './../../models/product';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CartItem } from 'src/app/models/cart-item';

@Component({
  selector: 'app-product-details',
  templateUrl: './product-details.component.html',
  styleUrls: ['./product-details.component.css']
})
export class ProductDetailsComponent implements OnInit {
  product: Product =new Product();

  constructor(private productService: ProductService,
              private cartService: CartService,
              private route: ActivatedRoute) { }

  ngOnInit(): void {
    this.route.paramMap.subscribe(() => {
      this.handleProductDetails();
    });
  }


  handleProductDetails() {
    const id =+this.route.snapshot.paramMap.get('id');
    this.productService.getProduct(id).subscribe(
      (product => {
      this.product =product;
    }))
  }

  onAddToChart() {
    const cartItem =new CartItem(this.product);
    this.cartService.addToCart(cartItem);
  }

}
