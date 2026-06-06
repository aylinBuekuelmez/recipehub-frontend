import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import { Observable } from 'rxjs';
import { Task } from './recipe';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class TaskService {
  baseUrl = 'http://localhost:3000';

  constructor(private http: HttpClient,
    private authService: AuthService) { }

  getMyTasks(): Observable<Task[]> {
    const headers = new HttpHeaders({
      Authorization: 'Bearer ' + this.authService.token
    });

    return this.http.get<Task[]>(
      this.baseUrl + '/tasks/my-tasks',
      { headers: headers }
    );
  }

  updateTask(task: Task): Observable<Task> {
    const headers = new HttpHeaders({
      Authorization: 'Bearer ' + this.authService.token
    });

    return this.http.put<Task>(
      this.baseUrl + '/tasks/' + task.id,
      task,
      { headers: headers }
    );
  }

  getAllTasks(): Observable<Task[]> {
    const headers = new HttpHeaders({
      Authorization: 'Bearer ' + this.authService.token
    });

    return this.http.get<Task[]>(
      this.baseUrl + '/tasks',
      { headers: headers }
    );
  }

  createTask(task: Partial<Task>): Observable<Task> {
    const headers = new HttpHeaders({
      Authorization: 'Bearer ' + this.authService.token
    });

    return this.http.post<Task>(
      this.baseUrl + '/tasks',
      task,
      { headers: headers }
    );
  }

  deleteTask(id: number): Observable<any> {
    const headers = new HttpHeaders({
      Authorization: 'Bearer ' + this.authService.token
    });

    return this.http.delete<any>(
      this.baseUrl + '/tasks/' + id,
      { headers: headers }
    );
  }

}
