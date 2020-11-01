import { CartService } from './../../services/cart.service';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Product } from 'src/app/models/product';
import { ProductService } from 'src/app/services/product.service';
import { CartItem } from 'src/app/models/cart-item';

@Component({
  selector: 'app-product-list',
  templateUrl: './product-list-grid.component.html',
  styleUrls: ['./product-list.component.css']
})
export class ProductListComponent implements OnInit {
  products:Product[] =[];
  currentCategoryId:number =1;
  previousCategoryId:number =1;
  searchMode:boolean =false;
  previousKeyword:string =null;
  
  pageNumber:number =1;
  pageSize:number =10;
  totalElements:number =0;

  constructor(private productService:ProductService,
              private routes:ActivatedRoute,
              private cartService:CartService) { }

  ngOnInit(): void {
    this.routes.paramMap.subscribe(() => {
      this.getProductList();
    });
  }

  getProductList() {
    this.searchMode =this.routes.snapshot.paramMap.has('keyword');
    if (this.searchMode) {
      this.handleSearchProducts();
    }
    else {
      this.handleListProducts();
    }
  }

  handleSearchProducts() {
    const keyword =this.routes.snapshot.paramMap.get('keyword');

    if (this.previousKeyword !=keyword) {
      this.pageNumber =1;
    }
    this.previousKeyword =keyword;

    this.productService.searchProductsPaginate(this.pageNumber-1,
                                               this.pageSize,
                                               keyword).subscribe(this.processResult());
  }

  handleListProducts() {
    const hasCategoryId: boolean =this.routes.snapshot.paramMap.has('id');
    if (hasCategoryId) {
      this.currentCategoryId =+this.routes.snapshot.paramMap.get('id');
    }
    else {
      this.currentCategoryId =1;
    }

    if (this.currentCategoryId != this.previousCategoryId) {
      this.pageNumber =1;
    }
    this.previousCategoryId =this.currentCategoryId;

    this.productService.getProductListPaginate(this.pageNumber-1, 
                                                this.pageSize,
                                                this.currentCategoryId).subscribe(this.processResult());
  }

  processResult() {
    return data => {
      this.products =data._embedded.products;
      this.pageNumber =data.page.number +1;
      this.totalElements =data.page.totalElements;
    }
  }

  updatePageSize(pageSize:number) {
    this.pageSize =pageSize;
    this.pageNumber =1;
    this.getProductList();
  }

  onAddToChart(product:Product) {
    const cartItem =new CartItem(product);
    this.cartService.addToCart(cartItem);
  }
  
}
