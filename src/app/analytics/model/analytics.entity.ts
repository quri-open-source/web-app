export class AnalyticsData {
  userId!: string;
  totalProjects!: number;
  blueprints!: number;
  designedGarments!: number;
  completed!: number;

  constructor(init?: Partial<AnalyticsData>) {
    Object.assign(this, init);
  }
}
