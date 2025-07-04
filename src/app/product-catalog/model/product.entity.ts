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
    updatedAt: Date
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
  }
}
