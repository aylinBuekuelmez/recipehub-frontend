import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { Task } from '../../shared/task';
import { TaskService } from '../../shared/task.service';
import { AuthService } from '../../shared/auth.service';
import { User } from '../../shared/user';

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './admin-dashboard.component.html',
  styleUrl: './admin-dashboard.component.css'
})
export class AdminDashboardComponent implements OnInit {

  users: User[] = [];
  tasks: Task[] = [];
  errorMessage = '';
  successMessage = '';

  taskForm = new FormGroup({
    title: new FormControl(''),
    description: new FormControl(''),
    user_id: new FormControl<number | null>(null)
  });

  constructor(private taskService: TaskService,
  private authService: AuthService) { }

  ngOnInit(): void {
    this.loadTasks();
    this.loadUsers();
  }

  loadTasks(): void {
    this.taskService.getAllTasks().subscribe({
      next: (tasks) => {
        this.tasks = tasks;
      },
      error: (err) => {
        console.log(err);
        this.errorMessage = 'Aufgaben konnten nicht geladen werden.';
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

  createTask(): void {
    const title = this.taskForm.value.title || '';
    const description = this.taskForm.value.description || '';
    const userId = this.taskForm.value.user_id;

    if (!title || !userId) {
      this.errorMessage = 'Titel und User-ID müssen angegeben werden.';
      return;
    }

    this.taskService.createTask({
      title: title,
      description: description,
      user_id: userId
    }).subscribe({
      next: (task) => {
        this.tasks.push(task);
        this.taskForm.reset();
        this.successMessage = 'Aufgabe wurde erstellt.';
        this.errorMessage = '';
      },
      error: (err) => {
        console.log(err);
        this.errorMessage = 'Aufgabe konnte nicht erstellt werden.';
        this.successMessage = '';
      }
    });
  }

  deleteTask(taskId: number): void {
    this.taskService.deleteTask(taskId).subscribe({
      next: () => {
        this.tasks = this.tasks.filter(task => task.id !== taskId);
        this.successMessage = 'Aufgabe wurde gelöscht.';
        this.errorMessage = '';
      },
      error: (err) => {
        console.log(err);
        this.errorMessage = 'Aufgabe konnte nicht gelöscht werden.';
        this.successMessage = '';
      }
    });
  }
}
