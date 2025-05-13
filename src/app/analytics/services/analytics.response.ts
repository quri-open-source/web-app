export interface AnalyticsResponse {
    id: string;
    user_id: string;
    project_id: string;
    garment_size: string;
    garment_color: string;
    created_at: string;
    last_modified: string;
    page_views: number;
    total_likes: number;
    click_count: number;
    conversion_rate: number;
}