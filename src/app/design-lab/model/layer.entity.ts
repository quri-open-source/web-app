interface LayerContent {
    x: number;
    y: number;
    rotation: number;
    opacity: number;
}

type TextAlign = 'left' | 'center' | 'right';

export interface TextContent extends LayerContent {
    text: string;
    fontFamily: string;
    fontSize: number;
    fontWeight: number;
    color: string;
    textAlign: TextAlign;
    italic?: boolean;
    underline?: boolean;
}

export interface ImageContent extends LayerContent {
    imageUrl: string;
    width: number;
    height: number;
    scale: number;
    maintainAspectRatio: boolean;
}

export class Layer {
    id: string;
    canvasId: string;
    type: string;
    zIndex: number;
    isVisible: boolean;
    createdAt: Date;
    content: TextContent | ImageContent;

    constructor() {
        this.id = '';
        this.canvasId = '';
        this.type = '';
        this.zIndex = 0;
        this.isVisible = false;
        this.createdAt = new Date();
        this.content = {
            x: 0,
            y: 0,
            rotation: 0,
            opacity: 1,
            imageUrl: '',
            width: 0,
            height: 0,
            scale: 1,
            maintainAspectRatio: false,
            text: '',
            fontFamily: '',
            fontSize: 0,
            fontWeight: 0,
            color: '',
            textAlign: 'left',
        };
    }
}