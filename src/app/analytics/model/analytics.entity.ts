export class Analytics {
    id: string;
    userId: string;
    projectId: string;
    garmentSize: string;
    garmentColor: string;
    createdAt: Date;
    lastModified: Date;
    pageViews: number;
    totalLikes: number;
    clickCount: number;
    conversionRate: number;

    constructor(userId: string, projectId: string, garmentSize: string, garmentColor: string) {
        this.id = crypto.randomUUID();
        this.userId = userId;
        this.projectId = projectId;
        this.garmentSize = garmentSize;
        this.garmentColor = garmentColor;
        this.createdAt = new Date();
        this.lastModified = new Date();
        this.pageViews = 0;
        this.totalLikes = 0;
        this.clickCount = 0;
        this.conversionRate = 0;
    }
}