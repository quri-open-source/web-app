import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AnalyticsDashboardComponent } from './dashboard.component';
import { AnalyticsService } from '../../../analytics/services/analytics.service';
import { of } from 'rxjs';
import { Analytics } from '../../../analytics/model/analytics.entity';

describe('AnalyticsDashboardComponent', () => {
  let component: AnalyticsDashboardComponent;
  let fixture: ComponentFixture<AnalyticsDashboardComponent>;
  let analyticsServiceSpy: jasmine.SpyObj<AnalyticsService>;

  const mockAnalytics: Analytics[] = [
    {
      id: '1',
      userId: 'user1',
      projectId: 'project1',
      garmentSize: 'M',
      garmentColor: 'blue',
      createdAt: new Date(),
      lastModified: new Date(),
      pageViews: 100,
      totalLikes: 50,
      clickCount: 30,
      conversionRate: 0.25
    },
    {
      id: '2',
      userId: 'user1',
      projectId: 'project2',
      garmentSize: 'L',
      garmentColor: 'red',
      createdAt: new Date(),
      lastModified: new Date(),
      pageViews: 200,
      totalLikes: 80,
      clickCount: 60,
      conversionRate: 0.30
    }
  ];

  beforeEach(() => {
    const spy = jasmine.createSpyObj('AnalyticsService', ['getAnalyticsByUserId']);

    TestBed.configureTestingModule({
      imports: [AnalyticsDashboardComponent],
      providers: [
        { provide: AnalyticsService, useValue: spy }
      ]
    });

    analyticsServiceSpy = TestBed.inject(AnalyticsService) as jasmine.SpyObj<AnalyticsService>;
    analyticsServiceSpy.getAnalyticsByUserId.and.returnValue(of(mockAnalytics));

    fixture = TestBed.createComponent(AnalyticsDashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load analytics on init', () => {
    expect(analyticsServiceSpy.getAnalyticsByUserId).toHaveBeenCalled();
  });

  it('should calculate total page views correctly', () => {
    expect(component.getTotalPageViews(mockAnalytics)).toBe(300);
  });

  it('should calculate total likes correctly', () => {
    expect(component.getTotalLikes(mockAnalytics)).toBe(130);
  });

  it('should calculate total clicks correctly', () => {
    expect(component.getTotalClicks(mockAnalytics)).toBe(90);
  });

  it('should calculate average conversion rate correctly', () => {
    expect(component.getAverageConversionRate(mockAnalytics)).toBe(0.275);
  });

  it('should identify most viewed project correctly', () => {
    expect(component.getMostViewedProject(mockAnalytics)?.id).toBe('2');
  });

  it('should identify most liked project correctly', () => {
    expect(component.getMostLikedProject(mockAnalytics)?.id).toBe('2');
  });

  it('should handle empty analytics array', () => {
    expect(component.getTotalPageViews([])).toBe(0);
    expect(component.getTotalLikes([])).toBe(0);
    expect(component.getTotalClicks([])).toBe(0);
    expect(component.getAverageConversionRate([])).toBe(0);
    expect(component.getMostViewedProject([])).toBeNull();
    expect(component.getMostLikedProject([])).toBeNull();
  });
});
