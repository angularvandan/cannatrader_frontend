import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { forkJoin } from 'rxjs';

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

}
