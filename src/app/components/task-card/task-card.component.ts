import { Component, Input, Output, EventEmitter } from '@angular/core';
import { Task } from '../../shared/recipe';

@Component({
  selector: 'app-task-card',
  standalone: true,
  imports: [],
  templateUrl: './task-card.component.html',
  styleUrl: './task-card.component.css'
})
export class TaskCardComponent {
  @Input() task!: Task;
  @Output() done = new EventEmitter<Task>();

  markAsDone(): void {
    this.done.emit(this.task);
  }
}
