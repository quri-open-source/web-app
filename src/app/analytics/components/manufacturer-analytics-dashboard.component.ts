import { Component, Input, OnInit } from '@angular/core';
import { ManufacturerAnalyticsService } from '../services/manufacturer-analytics.service';
import { ManufacturerAnalyticsData } from '../model/manufacturer-analytics.entity';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-manufacturer-analytics-dashboard',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './manufacturer-analytics-dashboard.component.html',
  styleUrls: ['./manufacturer-analytics-dashboard.component.css'],
})
export class ManufacturerAnalyticsDashboardComponent implements OnInit {
  @Input() userId!: string;
  analytics?: ManufacturerAnalyticsData | null;
  error?: string;

  constructor(private analyticsService: ManufacturerAnalyticsService) {}

  ngOnInit() {
    if (!this.userId) {
      this.error = 'User ID is required to load analytics.';
      return;
    }
    this.analyticsService.getUserAnalytics(this.userId).subscribe({
      next: (data: ManufacturerAnalyticsData) => this.analytics = data,
      error: () => this.error = 'Failed to load analytics data.'
    });
  }
}
