import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

@Injectable({ providedIn: 'root' })
export class DiscountPolicyService {
  private apiUrl = environment.apiBaseUrl + '/discounts_policies';

  constructor(private http: HttpClient) {}

  getDiscountPolicies(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl);
  }
}
