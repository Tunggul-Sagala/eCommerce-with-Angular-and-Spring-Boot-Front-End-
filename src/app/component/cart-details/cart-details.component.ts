import { CartService } from './../../services/cart.service';
import { CartItem } from './../../models/cart-item';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-cart-details',
  templateUrl: './cart-details.component.html',
  styleUrls: ['./cart-details.component.css']
})
export class CartDetailsComponent implements OnInit, OnDestroy {
  cartItems: CartItem[] =[];
  totalPrice: number =0.00;
  totalQuantity: number =0;
  subscription: Subscription;

  constructor(private cartService: CartService) { }
  
  ngOnInit(): void {
    this.listCartDetails();
  }

  listCartDetails() {
    this.cartItems =this.cartService.cartItems;
    this.subscription =this.cartService.totalPrice.subscribe(
      (data) => {
        this.totalPrice =data;
      });

    this.subscription =this.cartService.totalQuantity.subscribe(
      (data) => {
        this.totalQuantity =data;
      });
    
    this.cartService.computeCartTotals();
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  onIncrementQuantity(cartItem:CartItem) {
    this.cartService.addToCart(cartItem);
  }

  onDecrementQuantity(cartItem:CartItem) {
    this.cartService.removeCart(cartItem);
  }
}
