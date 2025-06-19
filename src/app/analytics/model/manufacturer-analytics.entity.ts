export class ManufacturerAnalyticsData {
  userId!: string;
  totalOrdersReceived!: number;
  pendingFulfillments!: number;
  producedProjects!: number;
  avgFulfillmentTimeDays!: number;

  constructor(init?: Partial<ManufacturerAnalyticsData>) {
    Object.assign(this, init);
  }
}
