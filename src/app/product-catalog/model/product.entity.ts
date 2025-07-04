import { Comment } from './comment.entity';
import { Project } from '../../design-lab/model/project.entity';

export class Product {
  id: string;
  projectId: string;
  priceAmount: number;
  priceCurrency: string;
  status: string;
  projectTitle: string;
  projectPreviewUrl: string | null;
  projectUserId: string;
  likeCount: number;
  createdAt: Date;
  updatedAt: Date;

  // Additional properties for UI compatibility
  price: number; // Alias for priceAmount
  likes: number; // Alias for likeCount
  rating: number;
  gallery: string[];
  tags: string[];
  projectDetails?: Project;

  constructor(
    id: string,
    projectId: string,
    priceAmount: number,
    priceCurrency: string,
    status: string,
    projectTitle: string,
    projectPreviewUrl: string | null,
    projectUserId: string,
    likeCount: number,
    createdAt: Date,
    updatedAt: Date,
    rating: number = 0,
    gallery: string[] = [],
    tags: string[] = [],
    projectDetails?: Project
  ) {
    this.id = id;
    this.projectId = projectId;
    this.priceAmount = priceAmount;
    this.priceCurrency = priceCurrency;
    this.status = status;
    this.projectTitle = projectTitle;
    this.projectPreviewUrl = projectPreviewUrl;
    this.projectUserId = projectUserId;
    this.likeCount = likeCount;
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
    this.rating = rating;
    this.gallery = gallery;
    this.tags = tags;
    this.projectDetails = projectDetails;

    // Set aliases
    this.price = priceAmount;
    this.likes = likeCount;
  }
}
