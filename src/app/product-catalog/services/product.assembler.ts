import {Product} from '../model/product.entity';
import {CommentAssembler} from './comment.assembler';
import {ProductResponse} from './product.response';

export class ProductAssembler {

  static toEntityFromResponse(response: ProductResponse): Product {

    const comments = CommentAssembler.toEntitiesFromResponse(response.comments);

    return new Product(
      response.id,
      response.project_id,
      response.manufacturer_id,
      response.price,
      response.likes,
      response.tags,
      new Date(response.created_at),
      response.gallery,
      response.rating,
      response.status,
      comments
    );
  }

  static toEntitiesFromResponse(responses: ProductResponse[]): Product[] {
    return responses.map(response => this.toEntityFromResponse(response));
  }
}




