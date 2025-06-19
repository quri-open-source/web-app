export interface ProductResponse {
  id: string;
  project_id: string;
  manufacturer_id: string;
  price: number;
  likes: number;
  tags: string[];
  created_at: Date;
  gallery: string[];
  rating: number;
  status: string;
  comments: CommentResponse[];
}

export interface CommentResponse {
  id: string;
  user_id: string;
  content: string;
  created_at: Date;
}

