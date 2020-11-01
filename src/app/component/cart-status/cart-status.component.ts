import { CartService } from './../../services/cart.service';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-cart-status',
  templateUrl: './cart-status.component.html',
  styleUrls: ['./cart-status.component.css']
})
export class CartStatusComponent implements OnInit, OnDestroy {
  totalPrice: number =0.00;
  totalQuantity: number =0;
  subscription: Subscription;

  constructor(private cartService: CartService) { }

  ngOnInit(): void {
    this.updateCartStatus();
  }

  updateCartStatus() {
    this.subscription =this.cartService.totalPrice.subscribe(
      (data) => {
        this.totalPrice =data;
      }
    )

    this.subscription =this.cartService.totalQuantity.subscribe(
      (data) => {
        this.totalQuantity =data;
      }
    )
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

}
