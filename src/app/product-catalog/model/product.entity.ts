import { Comment } from './comment.entity';
import { Project } from '../../design-lab/model/project.entity';

export class Product {
  id: string;
  projectId: string;
  manufacturerId: string;
  price: number;
  likes: number;
  tags: string[];
  createdAt: Date;
  gallery: string[];
  rating: number;
  status: string;
  comments: Comment[];
  projectDetails?: Partial<Project>;

  constructor(
    id: string,
    projectId: string,
    manufacturerId: string,
    price: number,
    likes: number,
    tags: string[],
    createdAt: Date,
    gallery: string[],
    rating: number,
    status: string,
    comments: Comment[]
  ) {
    this.id = id;
    this.projectId = projectId;
    this.manufacturerId = manufacturerId;
    this.price = price;
    this.likes = likes;
    this.tags = tags;
    this.createdAt = createdAt;
    this.gallery = gallery;
    this.rating = rating;
    this.status = status;
    this.comments = comments;
  }
}
