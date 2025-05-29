import { Component, OnInit } from '@angular/core';
import { ProjectService } from '../../../design-lab/services/project.service';
import { UserService } from '../../../shared/services/user.service';
import { Project } from '../../../design-lab/model/project.entity';
import { User } from '../../../core/model/user.entity';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatOptionModule } from '@angular/material/core';
import { RouterLink } from '@angular/router';

export interface EditableProject extends Project {
  editingName: boolean;
  editingGenre: boolean;
  editingSize: boolean;
  editingColor: boolean;
}

@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.css'],
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatOptionModule,
    RouterLink
  ]
})
export class UserProfileComponent implements OnInit {
  user: User | null = null;
  projects: EditableProject[] = [];
  editingName = false;
  editedName = '';
  editingBio = false;
  editedBio = '';
  selectedStatus: string = 'all';
  error: string | null = null;

  // Opciones válidas para size y género
  readonly sizeOptions = ['XS', 'S', 'M', 'L', 'XL', 'XXL'];
  readonly genreOptions = ['men', 'women', 'kid', 'other'];
  // Para restaurar color si se cancela
  private previousColor: { [id: string]: string } = {};

  constructor(
    private userService: UserService,
    private projectService: ProjectService
  ) {}

  ngOnInit(): void {
    this.loadUser();
  }

  loadUser(): void {
    this.userService.getCurrentUser().subscribe({
      next: (user: User) => {
        this.user = user;
        this.editedName = user.name;
        this.editedBio = user.bio;
        this.loadProjects();
      },
      error: (err) => {
        this.error = 'Failed to load user data. Please check your connection or try again later.';
      }
    });
  }

  loadProjects(): void {
    if (!this.user) return;
    this.projectService.getAllById(this.user.id).subscribe({
      next: (projects: any[]) => {
        this.projects = projects.map(p => {
          // Canonical normalization: always prefer camelCase, fallback to explorer-style
          const normalized: EditableProject = {
            ...p,
            id: p.id,
            userId: p.userId || p.user_id,
            createdAt: p.createdAt ? new Date(p.createdAt) : (p.created_at ? new Date(p.created_at) : new Date()),
            lastModified: p.lastModified ? new Date(p.lastModified) : (p.last_modified ? new Date(p.last_modified) : new Date()),
            status: p.status,
            name: p.name,
            genre: p.genre,
            previewImageUrl: p.previewImageUrl || p.preview_image_url || '',
            garmentColor: p.garmentColor || p.tshirt_color || p.garment_color || '',
            garmentSize: p.garmentSize || p.tshirt_size || p.garment_size || '',
            projectPrivacy: p.projectPrivacy || p.project_privacy || '',
            price: p.price,
            likes: p.likes,
            canvas: p.canvas,
            // Defensive: always ensure all fields are present and in canonical form
            editingName: false,
            editingGenre: false,
            editingSize: false,
            editingColor: false
          };
          return normalized;
        });
        this.error = null;
      },
      error: (err) => {
        this.error = 'Failed to load projects. Please check your connection or try again later.';
      }
    });
  }

  enableEditName(): void {
    this.editingName = true;
  }

  saveName(): void {
    if (this.user) {
      this.user.name = this.editedName;
      this.userService.updateUser(this.user).subscribe(() => {
        this.editingName = false;
      });
    }
  }

  cancelEditName(): void {
    if (this.user) {
      this.editedName = this.user.name;
    }
    this.editingName = false;
  }

  enableEditBio(): void {
    this.editingBio = true;
  }

  saveBio(): void {
    if (this.user) {
      this.user.bio = this.editedBio;
      this.userService.updateUser(this.user).subscribe(() => {
        this.editingBio = false;
      });
    }
  }

  cancelEditBio(): void {
    if (this.user) {
      this.editedBio = this.user.bio;
    }
    this.editingBio = false;
  }

  getBlueprints(): EditableProject[] {
    if (!this.user) return [];
    const blueprints = this.projects.filter(
      p =>
        typeof p.status === 'string' &&
        p.status.trim().toLowerCase() === 'blueprint' &&
        (p.userId === this.user!.id || (p as any).user_id === this.user!.id)
    );
    console.log('Blueprints filtrados:', blueprints);
    return blueprints;
  }

  getDesigns(): EditableProject[] {
    if (!this.user) return [];
    const designs = this.projects.filter(
      p =>
        typeof p.status === 'string' &&
        p.status.trim().toLowerCase() !== 'blueprint' &&
        (p.userId === this.user!.id || (p as any).user_id === this.user!.id)
    );
    console.log('Designs filtrados:', designs);
    return designs;
  }

  triggerAvatarInput(input: HTMLInputElement): void {
    input.click();
  }

  onAvatarSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files[0]) {
      const file = input.files[0];
      const reader = new FileReader();
      reader.onload = () => {
        if (this.user) {
          this.user.avatar_url = reader.result as string;
          this.userService.updateUser(this.user).subscribe();
        }
      };
      reader.readAsDataURL(file);
    }
  }

  // Validación y guardado de proyecto
  saveProject(project: any): void {
    // Validar size y género
    if (!this.sizeOptions.includes(project.garmentSize)) {
      project.garmentSize = this.sizeOptions[0];
    }
    if (!this.genreOptions.includes(project.genre)) {
      project.genre = this.genreOptions[0];
    }
    // Validar color (simple: debe ser string tipo #xxxxxx)
    if (!/^#[0-9A-Fa-f]{6}$/.test(project.garmentColor)) {
      project.garmentColor = this.previousColor[project.id] || '#EDEDED';
    }
    project.editingName = false;
    project.editingGenre = false;
    project.editingSize = false;
    project.editingColor = false;
    this.projectService.update(project.id, project).subscribe({
      next: () => {
        this.loadProjects();
      },
      error: (err) => {
        // Optionally handle error (e.g., show a message)
      }
    });
  }

  // Guardar color anterior antes de editar
  startEditColor(project: any): void {
    this.previousColor[project.id] = project.garmentColor;
    project.editingColor = true;
  }

  // Cancelar edición de color y restaurar
  cancelEditColor(project: any): void {
    project.garmentColor = this.previousColor[project.id] || '#EDEDED';
    project.editingColor = false;
  }

  getAllUserProjects(): EditableProject[] {
    if (!this.user) return [];
    return this.projects.filter(
      p => p.userId === this.user!.id || (p as any).user_id === this.user!.id
    );
  }

  getFilteredProjects(): EditableProject[] {
    if (this.selectedStatus === 'all') {
      return this.getAllUserProjects();
    }
    return this.getAllUserProjects().filter(p =>
      typeof p.status === 'string' &&
      p.status.trim().toLowerCase() === this.selectedStatus
    );
  }
}
