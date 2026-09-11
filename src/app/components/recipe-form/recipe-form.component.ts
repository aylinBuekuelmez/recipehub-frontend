import { Component, OnInit } from '@angular/core';
import { ReactiveFormsModule, FormGroup, FormControl, Validators } from '@angular/forms';
import { Router, ActivatedRoute, RouterLink } from '@angular/router';
import { RecipeService } from '../../shared/recipe.service';
import { CategoryService } from '../../shared/category.service';
import { Recipe } from '../../shared/recipe';
import { Category } from '../../shared/category';

@Component({
    selector: 'app-recipe-form',
    standalone: true,
    imports: [ReactiveFormsModule, RouterLink],
    templateUrl: './recipe-form.component.html',
    styleUrl: './recipe-form.component.css'
})
export class RecipeFormComponent implements OnInit {
    categories: Category[] = [];
    errorMessage = '';
    isEditMode = false;
    recipeId: number | null = null;

    recipeForm = new FormGroup({
        title: new FormControl('', [Validators.required, Validators.minLength(3)]),
        description: new FormControl('', [Validators.required]),
        ingredients: new FormControl('', [Validators.required]),
        category_id: new FormControl('', [Validators.required])
    });

    constructor(
        private recipeService: RecipeService,
        private categoryService: CategoryService,
        private router: Router,
        private route: ActivatedRoute
    ) { }

    ngOnInit(): void {
        this.categoryService.getAllCategories().subscribe({
            next: (categories) => {
                this.categories = categories;
            },
            error: (err) => {
                console.log(err);
                this.errorMessage = 'Kategorien konnten nicht geladen werden.';
            }
        });

        const id = this.route.snapshot.paramMap.get('id');
        if (id) {
            this.isEditMode = true;
            this.recipeId = Number(id);
            this.recipeService.getRecipeById(this.recipeId).subscribe({
                next: (recipe) => {
                    this.recipeForm.setValue({
                        title: recipe.title,
                        description: recipe.description,
                        ingredients: recipe.ingredients,
                        category_id: String(recipe.category_id)
                    });
                },
                error: (err) => {
                    console.log(err);
                    this.errorMessage = 'Rezept konnte nicht geladen werden.';
                }
            });
        }
    }

    onSubmit(): void {
        if (this.recipeForm.invalid) return;

        const recipe: Recipe = {
            id: this.recipeId ?? 0,
            title: this.recipeForm.value.title!,
            description: this.recipeForm.value.description!,
            ingredients: this.recipeForm.value.ingredients!,
            category_id: Number(this.recipeForm.value.category_id),
            user_id: 0
        };

        if (this.isEditMode) {
            this.recipeService.updateRecipe(recipe).subscribe({
                next: () => {
                    this.router.navigate(['/recipes']);
                },
                error: (err) => {
                    console.log(err);
                    this.errorMessage = 'Rezept konnte nicht aktualisiert werden.';
                }
            });
        } else {
            this.recipeService.createRecipe(recipe).subscribe({
                next: () => {
                    this.router.navigate(['/recipes']);
                },
                error: (err) => {
                    console.log(err);
                    this.errorMessage = 'Rezept konnte nicht erstellt werden.';
                }
            });
        }
    }

    onAbbrechen(): void {
        this.router.navigate(['/recipes']);
    }
}