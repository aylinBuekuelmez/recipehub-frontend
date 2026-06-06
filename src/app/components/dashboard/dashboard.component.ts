import { Component, OnInit } from '@angular/core';
import { TaskService } from '../../shared/task.service';
import { Task } from '../../shared/recipe';
import { TaskCardComponent } from '../task-card/task-card.component';


@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [TaskCardComponent],
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

  markAsDone(task: Task): void {
    const updatedTask: Task = {
      ...task,
      status: 'done'
    };

    this.taskService.updateTask(updatedTask).subscribe({
      next: (taskFromBackend) => {
        task.status = taskFromBackend.status;
      },
      error: (err) => {
        console.log(err);
        this.errorMessage = 'Aufgabe konnte nicht aktualisiert werden.';
      }
    });
  }

  get openTasks(): Task[] {
    return this.tasks.filter(task => task.status !== 'done');
  }

  get doneTasks(): Task[] {
    return this.tasks.filter(task => task.status === 'done');
  }

  get progress(): number {
    if (this.tasks.length === 0) {
      return 0;
    }

    return Math.round((this.doneTasks.length / this.tasks.length) * 100);
  }

}
