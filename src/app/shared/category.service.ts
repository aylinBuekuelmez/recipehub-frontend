import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Category } from './category';

@Injectable({
    providedIn: 'root'
})
export class CategoryService {
    baseUrl = 'http://localhost:3000';

    constructor(private http: HttpClient) { }

    private getHeaders(): HttpHeaders {
        const token = localStorage.getItem('token');
        return new HttpHeaders({ Authorization: `Bearer ${token}` });
    }

    getAllCategories(): Observable<Category[]> {
        return this.http.get<Category[]>(`${this.baseUrl}/categories`, {
            headers: this.getHeaders()
        });
    }

    createCategory(category: Category): Observable<Category> {
        return this.http.post<Category>(`${this.baseUrl}/categories`, category, {
            headers: this.getHeaders()
        });
    }

    deleteCategory(id: number): Observable<object> {
        return this.http.delete(`${this.baseUrl}/categories/${id}`, {
            headers: this.getHeaders()
        });
    }
}