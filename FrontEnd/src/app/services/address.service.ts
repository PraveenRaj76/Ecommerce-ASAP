import { Injectable } from '@angular/core';
import {environment} from "../../environments/environment";
import {BehaviorSubject, catchError, Observable, of} from "rxjs";
import {AddressModel} from "../models/address.model";
import {HttpClient, HttpErrorResponse} from "@angular/common/http";

@Injectable({
  providedIn: 'root'
})
export class AddressService {

  private SERVER_URL = environment.SERVER_URL;

  constructor(private http: HttpClient) { }

  /* This is to fetch all addresses from the backend server */
  getAllAddresses(): Observable<AddressModel> {
    return this.http.get<AddressModel>(this.SERVER_URL + `/address`);
  }

  /* GET SINGLE ADDRESS FROM SERVER */
  getSingleAddress(userId: number) {
    return this.http.get<AddressModel>(this.SERVER_URL + `/address/` + userId);
  }

  /* INSERT NEW ADDRESS */
  newAddress(userId: number, formData: any): Observable<{ message: string }> {
    const {address, city, state, country, pincode, phone} = formData;
    return this.http.post<{ message: string }>(`${this.SERVER_URL}/address/new`, {
      userId,
      addresses: {
        address,
        city,
        state,
        country,
        pincode,
        phone
      }
    })
  }

}
