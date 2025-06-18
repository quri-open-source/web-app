import { Component, Input, OnInit } from '@angular/core';
import { AnalyticsService } from '../services/analytics.service';
import { AnalyticsData } from '../model/analytics.entity';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-analytics-dashboard',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './customer-analytics-dashboard.component.html',
  styleUrls: ['./customer-analytics-dashboard.component.css'],
})
export class AnalyticsDashboardComponent implements OnInit {
  @Input() userId!: string;
  analytics?: AnalyticsData | null;
  error?: string;

  constructor(private analyticsService: AnalyticsService) {}

  ngOnInit() {
    if (!this.userId) {
      this.error = 'User ID is required to load analytics.';
      return;
    }
    this.analyticsService.getUserAnalytics(this.userId).subscribe({
      next: (data: AnalyticsData) => this.analytics = data,
      error: () => this.error = 'Failed to load analytics data.'
    });
  }
}