import { HttpClient } from '@angular/common/http';
import { inject } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

export abstract class BaseService<T> {
  protected http = inject(HttpClient);
  protected apiUrl = environment.apiBaseUrl;
  protected path: string;

  constructor(path: string) {
    this.path = path;
  }

  protected resourcePath(): string {
    return `${this.apiUrl}${this.path}`;
  }

  getURL(): string {
    return this.resourcePath();
  }

  getAll(): Observable<T[]> {
    return this.http.get<T[]>(this.resourcePath());
  }

  getById(id: string): Observable<T> {
    return this.http.get<T>(`${this.resourcePath()}/${id}`);
  }

  create(entity: T): Observable<T> {
    return this.http.post<T>(this.resourcePath(), entity);
  }

  update(id: string, entity: T): Observable<T> {
    return this.http.put<T>(`${this.resourcePath()}/${id}`, entity);
  }

  delete(id: string): Observable<void> {
    return this.http.delete<void>(`${this.resourcePath()}/${id}`);
  }
}
