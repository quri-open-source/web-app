import { Comment } from '../model/comment.entity';
import {CommentResponse} from './product.response';

export class CommentAssembler {

  static toEntityFromResponse(response: CommentResponse): Comment {
    return new Comment(
      response.id,
      response.user_id,
      response.content,
      response.created_at,
    );
  };

  static toEntitiesFromResponse(responses: CommentResponse[]): Comment[] {
    return responses.map(response => CommentAssembler.toEntityFromResponse(response));
  }
}

