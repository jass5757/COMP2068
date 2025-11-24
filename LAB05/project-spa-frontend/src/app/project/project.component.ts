import { Component, OnInit } from '@angular/core';
import { ProjectService, Project } from '../services/project.service';

@Component({
  selector: 'app-project',
  templateUrl: './project.component.html',
  styleUrls: ['./project.component.css']
})
export class ProjectComponent implements OnInit {
  projects: Project[] = [];
  loading: boolean = true;
  error: string = '';

  // Form fields
  _id: string = '';
  name: string = '';
  dueDate: string = '';
  course: string = '';

  constructor(private projectService: ProjectService) { }

  ngOnInit(): void {
    this.loadProjects();
  }

  loadProjects(): void {
    this.projectService.getProjects().subscribe({
      next: (data) => {
        this.projects = data;
        this.loading = false;
      },
      error: (err) => {
        this.error = 'Failed to load projects';
        this.loading = false;
        console.error('Error loading projects:', err);
      }
    });
  }

  addProject(): void {
    const newProject: Project = {
      name: this.name,
      dueDate: new Date(this.dueDate),
      course: this.course
    };

    this.projectService.addProject(newProject).subscribe({
      next: (data) => {
        console.log('Project added successfully');
        this.loadProjects();
        this.clearForm();
      },
      error: (err) => {
        console.error('Error adding project:', err);
        alert('Failed to add project');
      }
    });
  }

  deleteProject(id: string): void {
    if (confirm('Are you sure you want to delete this project?')) {
      this.projectService.deleteProject(id).subscribe({
        next: () => {
          console.log('Project deleted successfully');
          this.loadProjects();
        },
        error: (err) => {
          console.error('Error deleting project:', err);
          alert('Failed to delete project');
        }
      });
    }
  }

  selectProject(project: Project): void {
    this._id = project._id || '';
    this.name = project.name;
    this.dueDate = new Date(project.dueDate).toISOString().substring(0, 10);
    this.course = project.course;
  }

  updateProject(): void {
    const updatedProject: Project = {
      _id: this._id,
      name: this.name,
      dueDate: new Date(this.dueDate),
      course: this.course
    };

    this.projectService.updateProject(updatedProject).subscribe({
      next: () => {
        console.log('Project updated successfully');
        this.loadProjects();
        this.clearForm();
      },
      error: (err) => {
        console.error('Error updating project:', err);
        alert('Failed to update project');
      }
    });
  }

  clearForm(): void {
    this._id = '';
    this.name = '';
    this.dueDate = '';
    this.course = '';
  }
}