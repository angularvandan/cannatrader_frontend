import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { forkJoin } from 'rxjs';
import { IProduct } from '../models/product';

@Injectable({
  providedIn: 'root'
})
export class ProductService {

  private baseUrl = "https://cannatrader.onrender.com";


  constructor(private http: HttpClient) { }

  addProduct(productData: any) {
    return this.http.post(`${this.baseUrl}/api/product/add-product`, productData);
  }

  getAllValueForAddProduct() {
    const getAllCategory = this.http.get(`${this.baseUrl}/api/category/getCategories`);
    const getAllTHCRange = this.http.get(`${this.baseUrl}/api/category/getTHCrange`);
    const getAllStrainType = this.http.get(`${this.baseUrl}/api/category/getStrainTypes`);
    const getAllGrowMedia = this.http.get(`${this.baseUrl}/api/category/getGrowMedia`);
    const getAllGrothMethod = this.http.get(`${this.baseUrl}/api/category/getGrowthMethod`);
    const getAllTrimMethod = this.http.get(`${this.baseUrl}/api/category/getTrimMethod`);
    const getAllDryMethod = this.http.get(`${this.baseUrl}/api/category/getDryMethod`);

    return forkJoin([getAllCategory, getAllTHCRange, getAllStrainType, getAllGrowMedia, getAllGrothMethod, getAllTrimMethod, getAllDryMethod]);

  }
  getSubCategory(id: any) {
    return this.http.get(`${this.baseUrl}/api/category/getSubCategories/${id}`);
  }

  getAllProducts(params: any) {

    let queryParams = new HttpParams();

    // Add form values to queryParams
    Object.keys(params).forEach((key) => {
      if (params[key] !== null && params[key] !== '') {
        queryParams = queryParams.append(key, params[key]);
      }
    });

    return this.http.get(`${this.baseUrl}/api/product/get-products`, { params: queryParams });
  }

  getRecentListingProducts(params: any) {

    let queryParams = new HttpParams();

    Object.keys(params).forEach((key) => {
      if (params[key] !== null && params[key] !== '') {
        queryParams = queryParams.append(key, params[key]);
      }
    });
    return this.http.get(`${this.baseUrl}/api/product/get-recent-listing`, { params: queryParams });
  }

  getProductById(id: string) {
    return this.http.post(`${this.baseUrl}/api/product/${id}`, {
      lng: "1.8674654",
      lat: "1.68465",
      userId: "61e5e90c-6b8a-4053-86ad-6d8b291f674d"
    });
  }
  editProductById(id:string,body:any){
    return this.http.put(`${this.baseUrl}/api/product/${id}`,body);
  }
  deleteProductById(id:string){
    return this.http.delete(`${this.baseUrl}/api/product/${id}`);
  }

  rateProduct(id:string,body:any){
    return this.http.post(`${this.baseUrl}/api/rating/rate-product/${id}`,body)
  }
  addProductToWishlist(id:string){
    return this.http.post(`${this.baseUrl}/api/wishlist/${id}`,{});
  }
  removeProductFromWishlist(id:string){
    return this.http.delete(`${this.baseUrl}/api/wishlist/${id}`,{});
  }
  getAllWishlistProducts(){
    return this.http.get(`${this.baseUrl}/api/wishlist/getAllWishlist`);
  }

}
