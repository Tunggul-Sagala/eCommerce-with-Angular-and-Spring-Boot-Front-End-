import { ProductCategory } from './../models/product-category';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { Product } from '../models/product';

@Injectable({
  providedIn: 'root'
})
export class ProductService { 
  private productsUrl ='http://localhost:8888/api/products';
  private categoryUrl ='http://localhost:8888/api/product-category';

  constructor(private http:HttpClient) { }

  getProductList(categoryId: number): Observable<Product[]> {
    const searchUrl =`${this.productsUrl}/search/findByCategoryId?id=${categoryId}`;

    return this.http.get<GetResponseProduct>(searchUrl).pipe(
      map(response => {
        return response._embedded.products;
      })
    )
  }

  getProductListPaginate(page:number, 
                        pageSize:number, 
                        categoryId: number): Observable<GetResponseProduct> {

    const searchUrl =`${this.productsUrl}/search/findByCategoryId?id=${categoryId}`
                      + `&page=${page}&size=${pageSize}`;

    return this.http.get<GetResponseProduct>(searchUrl);
  }

  getProduct(id: number): Observable<Product> {
    const productUrl =`${this.productsUrl}/${id}`;
    return this.http.get<Product>(productUrl);
  } 

  searchProduct(keyword: string): Observable<Product[]> {
    const searchUrl =`${this.productsUrl}/search/findByNameContaining?name=${keyword}`;

    return this.http.get<GetResponseProduct>(searchUrl).pipe(
      map(response => {
        return response._embedded.products;
      })
    )
  }

  searchProductsPaginate(page:number, 
                        pageSize:number, 
                        keyword: string): Observable<GetResponseProduct> {

    const searchUrl =`${this.productsUrl}/search/findByNameContaining?name=${keyword}`
                    + `&page=${page}&size=${pageSize}`;

    return this.http.get<GetResponseProduct>(searchUrl);
  }

  getProductCategories(): Observable<ProductCategory[]> {
    return this.http.get<GetResponseProductCategory>(this.categoryUrl).pipe(
      map(response => {
        return response._embedded.productCategory;
      })
    );
  }

}

interface GetResponseProduct {
  _embedded : {
    products : Product[];
  },
  page : {
    size : number,
    totalElements : number,
    totalPages : number,
    number : number
  }
}

interface GetResponseProductCategory {
  _embedded : {
    productCategory : ProductCategory[];
  }
}


