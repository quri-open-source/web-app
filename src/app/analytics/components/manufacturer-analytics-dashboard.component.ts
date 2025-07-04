import { Component, Input, OnInit } from '@angular/core';
import { ManufacturerAnalyticsService } from '../services/manufacturer-analytics.service';
import { ManufacturerAnalyticsData } from '../model/manufacturer-analytics.entity';
import { CommonModule } from '@angular/common';
import { TranslateModule, TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-manufacturer-analytics-dashboard',
  standalone: true,
  imports: [CommonModule, TranslateModule],
  templateUrl: './manufacturer-analytics-dashboard.component.html',
  styleUrls: ['./manufacturer-analytics-dashboard.component.css'],
})
export class ManufacturerAnalyticsDashboardComponent implements OnInit {
  @Input() userId!: string;
  analytics?: ManufacturerAnalyticsData | null;
  error?: string;

  constructor(
    private analyticsService: ManufacturerAnalyticsService,
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
      next: (data: ManufacturerAnalyticsData) => this.analytics = data,
      error: () => {
        this.translate.get('analytics.failed_to_load').subscribe((message: string) => {
          this.error = message || 'Failed to load analytics data.';
        });
      }
    });
  }
}
