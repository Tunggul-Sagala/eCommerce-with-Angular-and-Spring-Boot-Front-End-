import { CartItem } from './../models/cart-item';
import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CartService {
  
  cartItems: CartItem[] =[];
  totalPrice: Subject<number> =new Subject<number>();
  totalQuantity: Subject<number> =new Subject<number>();

  constructor() { }

  addToCart(cartItem: CartItem) {
    let alreadyExistsInCart: boolean =false;
    let existingCartItem: CartItem =undefined;

    existingCartItem =this.cartItems.find(tempCartItem => tempCartItem.id === cartItem.id);
    
    alreadyExistsInCart =(existingCartItem !=undefined);

    if (alreadyExistsInCart) {
      existingCartItem.quantity++;
    }
    else {
      this.cartItems.push(cartItem);
    }

    this.computeCartTotals();
    
  }

  computeCartTotals() {
    let totalPriceValue: number =0;
    let totalQuantityValue: number =0;

    for (let currentCartItem of this.cartItems) {
      totalPriceValue +=currentCartItem.unitPrice * currentCartItem.quantity;
      totalQuantityValue +=currentCartItem.quantity;
    }

    this.totalPrice.next(totalPriceValue);
    this.totalQuantity.next(totalQuantityValue);
  }

  removeCart(cartItem: CartItem) {
    cartItem.quantity--;
    if (cartItem.quantity ===0) {
      const index =this.cartItems.findIndex(tempCartItem => tempCartItem.id === cartItem.id);

      if (index > -1) {
        this.cartItems.splice(index,1);
        this.computeCartTotals
      }
    }
    else {
      this.computeCartTotals();
    }
  }

}
