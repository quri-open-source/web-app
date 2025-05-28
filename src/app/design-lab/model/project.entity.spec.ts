import { Project } from './project.entity';

describe('Project', () => {
  it('should create an instance', () => {
    expect(new Project('user-001', 'Test Project', 'men', 'M', '#FFFFFF')).toBeTruthy();
  });
});