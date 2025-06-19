export class Comment {
  id: string;
  userId: string;
  text: string;
  createdAt: Date;
  constructor(id: string, text: string, userId: string, createdAt: Date) {
    this.id = id;
    this.userId = userId;
    this.text = text;
    this.createdAt = createdAt;
  }
}
