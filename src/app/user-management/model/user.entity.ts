export class User {
  id: string;
  email: string;
  name: string;
  created_at: string;
  password: string; // Optional for creation, not returned in responses

  constructor(id: string, email: string, name: string, created_at: string, password: string) {
    this.id = id;
    this.email = email;
    this.name = name;
    this.created_at = created_at;
    this.password = password;
  }
}
