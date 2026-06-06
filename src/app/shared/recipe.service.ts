import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Recipe } from './recipe';

@Injectable({
    providedIn: 'root'
})
export class RecipeService {
    baseUrl = 'http://localhost:3000';

    constructor(private http: HttpClient) { }

    private getHeaders(): HttpHeaders {
        const token = localStorage.getItem('token');
        return new HttpHeaders({ Authorization: `Bearer ${token}` });
    }

    getAllRecipes(): Observable<Recipe[]> {
        return this.http.get<Recipe[]>(`${this.baseUrl}/recipes`, {
            headers: this.getHeaders()
        });
    }

    getRecipesByCategory(categoryId: number): Observable<Recipe[]> {
        return this.http.get<Recipe[]>(`${this.baseUrl}/recipes?category=${categoryId}`, {
            headers: this.getHeaders()
        });
    }

    getRecipeById(id: number): Observable<Recipe> {
        return this.http.get<Recipe>(`${this.baseUrl}/recipes/${id}`, {
            headers: this.getHeaders()
        });
    }

    createRecipe(recipe: Recipe): Observable<Recipe> {
        return this.http.post<Recipe>(`${this.baseUrl}/recipes`, recipe, {
            headers: this.getHeaders()
        });
    }

    updateRecipe(recipe: Recipe): Observable<Recipe> {
        return this.http.put<Recipe>(`${this.baseUrl}/recipes/${recipe.id}`, recipe, {
            headers: this.getHeaders()
        });
    }

    deleteRecipe(id: number): Observable<object> {
        return this.http.delete(`${this.baseUrl}/recipes/${id}`, {
            headers: this.getHeaders()
        });
    }
}