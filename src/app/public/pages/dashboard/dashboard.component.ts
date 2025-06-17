import { Component, OnInit, ViewChild } from '@angular/core';
import { AnalyticsData } from '../../../analytics/model/analytics.entity';
import { ProjectService } from '../../../design-lab/services/project.service';
import { Project } from '../../../design-lab/model/project.entity';
import { CommonModule } from '@angular/common';
import { AnalyticsDashboardComponent } from '../../../analytics/components/analytics-dashboard.component';
import { MatButtonModule } from '@angular/material/button';
import { MatTableModule } from '@angular/material/table';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatIconModule } from '@angular/material/icon';
import { MatPaginatorModule, MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { UserService } from '../../../user-management/services/user.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    AnalyticsDashboardComponent,
    MatButtonModule,
    MatTableModule,
    MatProgressSpinnerModule,
    MatIconModule,
    MatPaginatorModule
  ],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  analytics: AnalyticsData | null = null;
  projects: Project[] = [];
  loading = true;
  userId!: string;
  displayedColumns: string[] = [
    'name', 'genre', 'garmentColor', 'garmentSize', 'status', 'createdAt', 'lastModified', 'actions'
  ];
  dataSource = new MatTableDataSource<Project>([]);
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  constructor(
    private projectService: ProjectService,
    private router: Router,
    private userService: UserService
  ) {}

  ngOnInit(): void {
    this.userId = this.userService.getSessionUserId();
    this.loadDashboard();
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
  }

  loadDashboard() {
    this.loading = true;
    this.projectService.getUserBlueprints().subscribe({
      next: (projectsData: Project[]) => {
        this.projects = projectsData;
        this.dataSource.data = projectsData;
      },
      error: () => {
        this.projects = [];
        this.dataSource.data = [];
      },
      complete: () => this.loading = false
    });
  }

  createNewProject() {
    this.router.navigate(['/design-lab/new']);
  }

  navigateToProject(project: Project) {
    this.router.navigate([`/design-lab/${project.id}`]);
  }

  getColorDisplay(color: any): string {
    if (!color) return 'Unknown';
    if (typeof color === 'string' && color.startsWith('#')) {
      return color;
    }
    if (typeof color === 'string') {
      return color.replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase());
    }
    return String(color);
  }

  formatDate(value: Date | string): string {
    if (!value) return '';
    return new Date(value).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  }

  formatStatus(status: string): string {
    return status.replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase());
  }
}
