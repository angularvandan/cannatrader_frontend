import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
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

  getProductById(id: string,userId:string) {
    console.log(userId);
    return this.http.post(`${this.baseUrl}/api/product/${id}`, {
      lng: "1.8674654",
      lat: "1.68465",
      userId: userId
    });
  }

  imageFileToImageUrl(body:any){
    return this.http.post(`${this.baseUrl}/api/users/uploadImages`,body);
  }

  pdfImageToPdfUrl(body:{}){
    return this.http.post(`${this.baseUrl}/api/users/uploadPDF`,body);
  }

  editProductById(id: string, body: any) {
    return this.http.put(`${this.baseUrl}/api/product/${id}`, body);
  }
  deleteProductById(id: string) {
    return this.http.delete(`${this.baseUrl}/api/product/${id}`);
  }

  rateProduct(id: string, body: any) {
    return this.http.post(`${this.baseUrl}/api/rating/rate-product/${id}`, body)
  }
  addProductToWishlist(id: string) {
    return this.http.post(`${this.baseUrl}/api/wishlist/${id}`, {});
  }
  removeProductFromWishlist(id: string) {
    return this.http.delete(`${this.baseUrl}/api/wishlist/${id}`);
  }
  getAllWishlistProducts(pagination:any) {
    let params = new HttpParams()
      .set('lat', 1.112)
      .set('lng', 12.123)
      .set('limit',pagination.limit)
      .set('page',pagination.page);

    return this.http.get(`${this.baseUrl}/api/wishlist/getAllWishlist`,{params});
  }

  subscribeCompany(companyId:string){
    return this.http.post(`${this.baseUrl}/api/subscribtion/subscribe`,{companyId})
  }
  unSubscribeCompany(companyId:string){
    const body = { companyId: companyId };
    const options = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      }),
      body: body
    };
    return this.http.delete(`${this.baseUrl}/api/subscribtion/unsubscribe`,options)
  }
  getSubscribedCompany(pagination:any){
    let params = new HttpParams()
      .set('limit',pagination.limit)
      .set('page',pagination.page);
    return this.http.get(`${this.baseUrl}/api/subscribtion/subscriptions`,{params});
  }
  startChat(userId2:string){
    return this.http.post(`${this.baseUrl}/api/chat/create`,{userId2});
  }
  getAllChats(){
    return this.http.get(`${this.baseUrl}/api/chat`);
  }
  getAllMessages(chatId:string){
    return this.http.get(`${this.baseUrl}/api/chat/messages/${chatId}`);
  }
  readAllMessage(chatId:string){
    return this.http.post(`${this.baseUrl}/api/chat/read-all-messages`,{chatId});
  }
}
