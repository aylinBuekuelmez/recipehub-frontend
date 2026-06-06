import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { RecipeService } from '../../shared/recipe.service';
import { CategoryService } from '../../shared/category.service';
import { AuthService } from '../../shared/auth.service';
import { Recipe } from '../../shared/recipe';
import { Category } from '../../shared/category';

@Component({
  selector: 'app-recipe-detail',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './recipe-detail.component.html',
  styleUrl: './recipe-detail.component.css'
})
export class RecipeDetailComponent implements OnInit {
    recipe: Recipe | null = null;
    category: Category | null = null;
    errorMessage = '';

    constructor(
        private recipeService: RecipeService,
        private categoryService: CategoryService,
        private authService: AuthService,
        private route: ActivatedRoute,
        private router: Router
    ) { }

    ngOnInit(): void {
        const id = this.route.snapshot.paramMap.get('id');
        if (id) {
            this.recipeService.getRecipeById(Number(id)).subscribe({
                next: (recipe) => {
                    this.recipe = recipe;
                    this.categoryService.getAllCategories().subscribe({
                        next: (categories) => {
                            this.category = categories.find(c => c.id === recipe.category_id) || null;
                        },
                        error: (err) => {
                            console.log(err);
                        }
                    });
                },
                error: (err) => {
                    console.log(err);
                    this.errorMessage = 'Rezept konnte nicht geladen werden.';
                }
            });
        }
    }

    canEdit(): boolean {
        const currentUser = this.authService.getCurrentUser();
        if (!currentUser) return false;
        return currentUser.id === this.recipe?.user_id || currentUser.role === 'admin';
    }

    deleteRecipe(): void {
        if (!this.recipe) return;
        this.recipeService.deleteRecipe(this.recipe.id).subscribe({
            next: () => {
                this.router.navigate(['/recipes']);
            },
            error: (err) => {
                console.log(err);
                this.errorMessage = 'Rezept konnte nicht gelöscht werden.';
            }
        });
    }

}
