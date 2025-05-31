import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UserInfoComponent } from '../../../user-management/components/profile/user-info/user-info.component';
import { UserService } from '../../../user-management/services/user.service';
import { ProjectService } from '../../../design-lab/services/project.service';
import { AuthService } from '../../../user-management/services/auth.service';
import { User } from '../../../user-management/model/user.entity';
import { Project } from '../../../design-lab/model/project.entity';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { ProjectCardComponent } from '../../../design-lab/components/project-card/project-card.component';
import { MatGridListModule } from '@angular/material/grid-list';

@Component({
  selector: 'app-user-profile',
  standalone: true,
  imports: [CommonModule, UserInfoComponent, MatProgressSpinnerModule, ProjectCardComponent, MatGridListModule],
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.css']
})
export class UserProfileComponent implements OnInit {
  user: User | null = null;
  projects: any[] = [];

  constructor(
    private userService: UserService,
    private projectService: ProjectService,
    private authService: AuthService
  ) {}

  ngOnInit() {
    const userId = this.authService.getCurrentUserId();
    this.userService.getUsers().subscribe((users: User[]) => {
      this.projectService.getAll().subscribe((projects: Project[]) => {
        const user = users.find(u => u.id === userId) || null;
        const userProjects = projects.filter(p => p.userId === userId);

        if (!user) {
          console.error('User not found');
          return;
        }

        this.user = user
        this.projects = userProjects;
      });
    });
  }

  onProjectEdited(edited: Project) {
    this.projects = this.projects.map(p => p.id === edited.id ? { ...p, ...edited } : p);
  }
}
