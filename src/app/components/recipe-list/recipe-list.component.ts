import { Component, OnInit } from '@angular/core';
import { RecipeService } from '../../shared/recipe.service';
import { CategoryService } from '../../shared/category.service';
import { Recipe } from '../../shared/recipe';
import { Category } from '../../shared/category';
import { RouterLink } from '@angular/router';

@Component({
    selector: 'app-recipe-list',
    standalone: true,
    imports: [RouterLink],
    templateUrl: './recipe-list.component.html',
    styleUrl: './recipe-list.component.css'
})
export class RecipeListComponent implements OnInit {
    recipes: Recipe[] = [];
    categories: Category[] = [];
    selectedCategoryId: number | null = null;
    errorMessage = '';

    constructor(
        private recipeService: RecipeService,
        private categoryService: CategoryService
    ) { }

    ngOnInit(): void {
        this.loadCategories();
        this.loadRecipes();
    }

    loadCategories(): void {
        this.categoryService.getAllCategories().subscribe({
            next: (categories) => {
                this.categories = categories;
            },
            error: (err) => {
                console.log(err);
                this.errorMessage = 'Kategorien konnten nicht geladen werden.';
            }
        });
    }

    loadRecipes(): void {
        if (this.selectedCategoryId) {
            this.recipeService.getRecipesByCategory(this.selectedCategoryId).subscribe({
                next: (recipes) => {
                    this.recipes = recipes;
                },
                error: (err) => {
                    console.log(err);
                    this.errorMessage = 'Rezepte konnten nicht geladen werden.';
                }
            });
        } else {
            this.recipeService.getAllRecipes().subscribe({
                next: (recipes) => {
                    this.recipes = recipes;
                },
                error: (err) => {
                    console.log(err);
                    this.errorMessage = 'Rezepte konnten nicht geladen werden.';
                }
            });
        }
    }

    selectCategory(categoryId: number | null): void {
        this.selectedCategoryId = categoryId;
        this.loadRecipes();
    }

    deleteRecipe(id: number): void {
        this.recipeService.deleteRecipe(id).subscribe({
            next: () => {
                this.recipes = this.recipes.filter(r => r.id !== id);
            },
            error: (err) => {
                console.log(err);
                this.errorMessage = 'Rezept konnte nicht gelöscht werden.';
            }
        });
    }
}