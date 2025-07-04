import { Product } from '../model/product.entity';
import { ProductResponse } from './product.response';
import { Project } from '../../design-lab/model/project.entity';

export class ProductAssembler {

  static toEntityFromResponse(response: ProductResponse, project?: Project): Product {
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
      new Date(response.updated_at),
      0, // rating - default to 0
      response.project_preview_url ? [response.project_preview_url] : [], // gallery - use preview if available
      [], // tags - empty array for now
      project // project details
    );
  }

  static toEntitiesFromResponse(responses: ProductResponse[], projects?: Project[]): Product[] {
    return responses.map((response, index) =>
      this.toEntityFromResponse(response, projects ? projects[index] : undefined)
    );
  }
}




