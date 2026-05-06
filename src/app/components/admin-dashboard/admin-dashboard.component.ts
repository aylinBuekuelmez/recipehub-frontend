import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
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
  selectedTaskId: number | null = null;

  taskForm = new FormGroup({
    title: new FormControl('', Validators.required),
    description: new FormControl(''),
    user_id: new FormControl<number | null>(null, Validators.required)
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

    if (this.taskForm.invalid) {
      this.errorMessage = 'Titel und Nutzer müssen angegeben werden.';
      this.successMessage = '';
      return;
    }


    this.taskService.createTask({
      title: title,
      description: description,
      user_id: userId!
    }).subscribe({
      next: (task) => {
        this.tasks.push(task);
        this.taskForm.reset();
        this.selectedTaskId = null;
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

  editTask(task: Task): void {
    this.selectedTaskId = task.id;

    this.taskForm.setValue({
      title: task.title,
      description: task.description,
      user_id: task.user_id
    });
  }

  saveTask(): void {
    if (this.taskForm.invalid) {
      this.errorMessage = 'Titel und Nutzer müssen angegeben werden.';
      this.successMessage = '';
      return;
    }

    if (this.selectedTaskId) {
      this.updateSelectedTask();
    } else {
      this.createTask();
    }
  }
  updateSelectedTask(): void {
    if (!this.selectedTaskId) {
      return;
    }

    const title = this.taskForm.value.title || '';
    const description = this.taskForm.value.description || '';
    const userId = this.taskForm.value.user_id;

    if (!userId) {
      this.errorMessage = 'Ein Nutzer muss ausgewählt werden.';
      this.successMessage = '';
      return;
    }

    const taskToUpdate: Task = {
      id: this.selectedTaskId,
      title: title,
      description: description,
      status: 'open',
      user_id: userId
    };

    this.taskService.updateTask(taskToUpdate).subscribe({
      next: (updatedTask) => {
        this.tasks = this.tasks.map(task =>
          task.id === updatedTask.id ? updatedTask : task
        );

        this.cancelEdit();

        this.successMessage = 'Aufgabe wurde aktualisiert.';
        this.errorMessage = '';
      },
      error: (err) => {
        console.log(err);
        this.errorMessage = 'Aufgabe konnte nicht aktualisiert werden.';
        this.successMessage = '';
      }
    });
  }

  cancelEdit(): void {
  this.selectedTaskId = null;
  this.taskForm.reset();
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
