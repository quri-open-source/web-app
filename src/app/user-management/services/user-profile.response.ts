export interface UserResponse {
  id: string;
  name: string;
  email: string;
  created_at: string; // Optional, may not be present in all responses
  password: string; // Optional, may not be present in all responses
  projects: Array<{ id: string; name: string }>;
}
