import { Component, Input, OnInit } from '@angular/core';
import { AnalyticsService } from '../services/analytics.service';
import { AnalyticsData } from '../model/analytics.entity';
import { CommonModule } from '@angular/common';
import { TranslateModule, TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-analytics-dashboard',
  standalone: true,
  imports: [CommonModule, TranslateModule],
  templateUrl: './customer-analytics-dashboard.component.html',
  styleUrls: ['./customer-analytics-dashboard.component.css'],
})
export class AnalyticsDashboardComponent implements OnInit {
  @Input() userId!: string;
  analytics?: AnalyticsData | null;
  error?: string;

  constructor(
    private analyticsService: AnalyticsService,
    private translate: TranslateService
  ) {}

  ngOnInit() {
    if (!this.userId) {
      this.translate.get('analytics.user_id_required').subscribe((message: string) => {
        this.error = message || 'User ID is required to load analytics.';
      });
      return;
    }
    this.analyticsService.getUserAnalytics(this.userId).subscribe({
      next: (data: AnalyticsData) => this.analytics = data,
      error: () => {
        this.translate.get('analytics.failed_to_load').subscribe((message: string) => {
          this.error = message || 'Failed to load analytics data.';
        });
      }
    });
  }
}
