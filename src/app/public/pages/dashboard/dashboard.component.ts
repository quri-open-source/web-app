import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AnalyticsService } from '../../../analytics/services/analytics.service';
import { Analytics } from '../../../analytics/model/analytics.entity';
import { Observable, tap } from 'rxjs';

@Component({
  selector: 'app-analytics-dashboard',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class AnalyticsDashboardComponent implements OnInit {
  analytics$: Observable<Analytics[]> = new Observable<Analytics[]>();
  currentUserId = 'user-001'; // Using a specific user ID for demonstration
  topProjects: Analytics[] = [];

  constructor(private analyticsService: AnalyticsService) { }

  ngOnInit(): void {
    this.loadAnalytics();
  }

  loadAnalytics(): void {
    this.analytics$ = this.analyticsService.getAnalyticsByUserId(this.currentUserId).pipe(
      tap(analytics => {
        // Store top 3 projects by page views for the toggle buttons
        this.topProjects = [...analytics]
          .sort((a, b) => b.pageViews - a.pageViews)
          .slice(0, 3);
      })
    );
  }

  loadAnalyticsByProject(projectId: string): void {
    this.analytics$ = this.analyticsService.getAnalyticsByProjectId(projectId);
  }

  getTotalPageViews(analytics: Analytics[]): number {
    return analytics.reduce((total, item) => total + item.pageViews, 0);
  }

  getTotalLikes(analytics: Analytics[]): number {
    return analytics.reduce((total, item) => total + item.totalLikes, 0);
  }

  getTotalClicks(analytics: Analytics[]): number {
    return analytics.reduce((total, item) => total + item.clickCount, 0);
  }

  getAverageConversionRate(analytics: Analytics[]): number {
    if (analytics.length === 0) return 0;
    const totalRate = analytics.reduce((total, item) => total + item.conversionRate, 0);
    return totalRate / analytics.length;
  }

  getMostViewedProject(analytics: Analytics[]): Analytics | null {
    if (analytics.length === 0) return null;
    return analytics.reduce((max, item) => item.pageViews > max.pageViews ? item : max, analytics[0]);
  }

  getMostLikedProject(analytics: Analytics[]): Analytics | null {
    if (analytics.length === 0) return null;
    return analytics.reduce((max, item) => item.totalLikes > max.totalLikes ? item : max, analytics[0]);
  }
}
