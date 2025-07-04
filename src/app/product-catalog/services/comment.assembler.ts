import { Comment } from '../model/comment.entity';
import {CommentResponse} from './product.response';

export class CommentAssembler {

  static toEntityFromResponse(response: CommentResponse): Comment {
    return new Comment(
      response.id,
      response.text,
      response.user_id,
      new Date(response.created_at)
    );
  };

  static toEntitiesFromResponse(responses: CommentResponse[]): Comment[] {
    return responses.map(response => CommentAssembler.toEntityFromResponse(response));
  }
}

