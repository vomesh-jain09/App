import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface GiftItem {
  id: string;
  name: string;
  price: number;
  status: boolean;
  rating: number;
  cover: string;
  description: string;
}

@Injectable({
  providedIn: 'root'
})
export class ServicsService {

  private baseUrl = 'http://localhost:5000/Product';  // Base URL

  constructor(private http: HttpClient) { }

  // ✅ Saare Products Lane ke liye
  public getAllItems(): Observable<GiftItem[]> {
    return this.http.get<GiftItem[]>(`${this.baseUrl}/get`);
  }

  // ✅ Single Product by ID
  public getItemById(id: string): Observable<GiftItem> {
    return this.http.get<GiftItem>(`${this.baseUrl}/${id}`);
  }
}
