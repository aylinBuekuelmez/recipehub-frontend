import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CategoryService } from '../../shared/category.service';
import { AuthService } from '../../shared/auth.service';
import { Category } from '../../shared/category';
import { User } from '../../shared/user';

@Component({
    selector: 'app-admin-dashboard',
    standalone: true,
    imports: [ReactiveFormsModule],
    templateUrl: './admin-dashboard.component.html',
    styleUrl: './admin-dashboard.component.css'
})
export class AdminDashboardComponent implements OnInit {

    categories: Category[] = [];
    users: User[] = [];
    errorMessage = '';
    successMessage = '';

    categoryForm = new FormGroup({
        name: new FormControl('', [Validators.required, Validators.minLength(3)])
    });

    constructor(private categoryService: CategoryService,
        private authService: AuthService) { }

    ngOnInit(): void {
        this.loadCategories();
        this.loadUsers();
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

    loadUsers(): void {
        this.authService.getAllUsers().subscribe({
            next: (users) => {
                this.users = users;
            },
            error: (err) => {
                console.log(err);
                this.errorMessage = 'Nutzer konnten nicht geladen werden.';
            }
        });
    }

    onSubmit(): void {
        if (this.categoryForm.invalid) return;

        const newCategory: Category = {
            id: 0,
            name: this.categoryForm.value.name!
        };

        this.categoryService.createCategory(newCategory).subscribe({
            next: (category) => {
                this.categories.push(category);
                this.categoryForm.reset();
                this.successMessage = 'Kategorie erfolgreich erstellt!';
                this.errorMessage = '';
            },
            error: (err) => {
                console.log(err);
                this.errorMessage = 'Kategorie konnte nicht erstellt werden.';
            }
        });
    }

    deleteCategory(id: number): void {
        this.categoryService.deleteCategory(id).subscribe({
            next: () => {
                this.categories = this.categories.filter(c => c.id !== id);
                this.successMessage = 'Kategorie erfolgreich gelöscht!';
                this.errorMessage = '';
            },
            error: (err) => {
                console.log(err);
                this.errorMessage = 'Kategorie konnte nicht gelöscht werden.';
            }
        });
    }
    deleteUser(id: number): void {
        this.authService.deleteUser(id).subscribe({
            next: () => {
                this.users = this.users.filter(u => u.id !== id);
                this.successMessage = 'Nutzer erfolgreich gelöscht!';
                this.errorMessage = '';
            },
            error: (err) => {
                console.log(err);
                this.errorMessage = 'Nutzer konnte nicht gelöscht werden.';
            }
        });

    }
}