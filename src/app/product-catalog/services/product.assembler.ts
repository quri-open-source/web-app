import { Product } from '../model/product.entity';
import { ProductResponse } from './product.response';

export class ProductAssembler {

  static toEntityFromResponse(response: ProductResponse): Product {
    return new Product(
      response.id,
      response.project_id,
      response.price_amount,
      response.price_currency,
      response.status,
      response.project_title,
      response.project_preview_url,
      response.project_user_id,
      response.like_count,
      new Date(response.created_at),
      new Date(response.updated_at)
    );
  }

  static toEntitiesFromResponse(responses: ProductResponse[]): Product[] {
    return responses.map(response => this.toEntityFromResponse(response));
  }
}




