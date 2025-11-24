import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

export interface Project {
  _id?: string;
  name: string;
  dueDate: Date;
  course: string;
}

@Injectable({
  providedIn: 'root'
})
export class ProjectService {
  private apiUrl = environment.serverAPI + 'projects';

  constructor(private http: HttpClient) { }

  getProjects(): Observable<Project[]> {
    return this.http.get<Project[]>(this.apiUrl);
  }

  addProject(newProject: Project): Observable<Project> {
    return this.http.post<Project>(this.apiUrl, newProject);
  }

  deleteProject(id: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }

  updateProject(project: Project): Observable<Project> {
    return this.http.put<Project>(this.apiUrl, project);
  }
}