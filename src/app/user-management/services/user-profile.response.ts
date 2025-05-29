export interface UserProfileResponse {
  id: string;
  name: string;
  email: string;
  projects: Array<{ id: string; name: string }>;
}
