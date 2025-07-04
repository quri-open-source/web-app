export interface ProductResponse {
  id: string;
  project_id: string;
  price_amount: number;
  price_currency: string;
  status: string;
  project_title: string;
  project_preview_url: string | null;
  project_user_id: string;
  like_count: number;
  created_at: string; 
  updated_at: string;
}