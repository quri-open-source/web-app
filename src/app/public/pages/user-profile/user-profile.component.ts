import { Component, OnInit } from '@angular/core';
import { ProjectService } from '../../../design-lab/services/project.service';
import { UserService } from '../../../shared/services/user.service';
import { Project } from '../../../design-lab/model/project.entity';
import { User } from '../../../core/model/user.entity';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.css'],
  standalone: true,
  imports: [CommonModule, FormsModule]
})
export class UserProfileComponent implements OnInit {
  user: User | null = null;
  projects: Project[] = [];
  editingName = false;
  editedName = '';
  editingBio = false;
  editedBio = '';

  constructor(
    private userService: UserService,
    private projectService: ProjectService
  ) {}

  ngOnInit(): void {
    this.loadUser();
  }

  loadUser(): void {
    this.userService.getCurrentUser().subscribe((user: User) => {
      this.user = user;
      this.editedName = user.name;
      this.editedBio = user.bio;
      this.loadProjects();
    });
  }

  loadProjects(): void {
    if (!this.user) return;
    this.projectService.getAllById(this.user.id).subscribe((projects: Project[]) => {
      this.projects = projects;
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

  getBlueprints(): Project[] {
    return this.projects.filter(p => p.status === 'blueprint');
  }

  getDesigns(): Project[] {
    return this.projects.filter(p => p.status === 'designed-garment' as any);
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
}
