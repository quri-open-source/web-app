// Example usage of the updated ProjectService
import { Component, inject } from '@angular/core';
import { ProjectService } from '../services/project.service';
import { CreateProjectRequest } from '../services/project.request';
import { GARMENT_COLOR, GARMENT_SIZE, PROJECT_GENDER } from '../../const';

@Component({
  selector: 'app-example-create-project',
  template: `
    <button (click)="createExampleProject()">Create Project</button>
  `
})
export class ExampleCreateProjectComponent {
  private projectService = inject(ProjectService);

  createExampleProject() {
    const createRequest: CreateProjectRequest = {
      title: "Demo 4",
      userId: "", // This will be overridden by the service with the authenticated user ID
      garmentColor: GARMENT_COLOR.BLACK,
      garmentGender: PROJECT_GENDER.MEN,
      garmentSize: GARMENT_SIZE.M
    };

    this.projectService.createProject(createRequest).subscribe({
      next: (project) => {
        console.log('Project created successfully:', project);
        // Handle success (redirect, show success message, etc.)
      },
      error: (error) => {
        console.error('Error creating project:', error);
        // Handle error (show error message, etc.)
      }
    });
  }
}
