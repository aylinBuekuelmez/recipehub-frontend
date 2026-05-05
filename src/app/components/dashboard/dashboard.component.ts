import { Component, OnInit } from '@angular/core';
import { TaskService } from '../../shared/task.service';
import { Task } from '../../shared/task';


@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
export class DashboardComponent implements OnInit {
  tasks: Task[] = [];
  errorMessage = '';

  constructor(private taskService: TaskService) { }

  ngOnInit(): void {
    this.taskService.getMyTasks().subscribe({
      next: (tasks) => {
        this.tasks = tasks;
      },
      error: (err) => {
        console.log(err);
        this.errorMessage = 'Aufgaben konnten nicht geladen werden.';
      }
    });
  }

}
