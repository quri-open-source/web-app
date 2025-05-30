import { Project } from '../model/project.entity';
import { ProjectResponse } from './project.response';
import { ProjectAssembler } from './project.assembler';

export class ProjectCardAssembler {
  static fromResponse(response: ProjectResponse): Project {
    return ProjectAssembler.ToEntityFromResponse(response);
  }

  static fromResponses(responses: ProjectResponse[]): Project[] {
    return responses.map(r => this.fromResponse(r));
  }
}
