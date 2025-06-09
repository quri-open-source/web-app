import { LayerType, TEXT_LAYER_BOLD_VALUE, TEXT_LAYER_REGULAR_VALUE } from "../../const";


export abstract class Layer {
    id: string;
    x: number;
    y: number;
    zIndex: number;
    opacity: number;
    visible: boolean;
    type: LayerType;

    constructor(
        id: string,
        x: number,
        y: number,
        zIndex: number,
        opacity: number,
        visible: boolean,
        type: LayerType
    ) {
        this.id = id;
        this.x = x;
        this.y = y;
        this.zIndex = zIndex;
        this.opacity = opacity;
        this.visible = visible;
        this.type = type;
    }

    abstract getCssStyles(): string;
    abstract getContent(): string;
}

export class ImageLayer extends Layer {
    imageUrl: string;

    constructor(
        id: string,
        x: number,
        y: number,
        zIndex: number,
        opacity: number,
        visible: boolean,
        imageUrl: string
    ) {
        super(id, x, y, zIndex, opacity, visible, LayerType.IMAGE);
        this.imageUrl = imageUrl;
    }

    getCssStyles(): string {
        return `position: absolute; left: ${this.x}px; top: ${
            this.y
        }px; z-index: ${this.zIndex}; opacity: ${this.opacity}; visibility: ${
            this.visible ? 'visible' : 'hidden'
        };`;
    }

    getContent(): string {
        return this.imageUrl;
    }
}

export class TextLayer extends Layer {
    textContent: string;
    fontSize: number;
    fontColor: string;
    fontFamily: string;
    bold: boolean;
    italic: boolean;
    underline: boolean;

    constructor(
        id: string,
        x: number,
        y: number,
        zIndex: number,
        opacity: number,
        visible: boolean,
        textContent: string,
        fontSize: number,
        fontColor: string,
        fontFamily: string,
        bold: boolean,
        italic: boolean,
        underline: boolean
    ) {
        super(id, x, y, zIndex, opacity, visible, LayerType.TEXT);
        this.textContent = textContent;
        this.fontSize = fontSize;
        this.fontColor = fontColor;
        this.fontFamily = fontFamily;
        this.bold = bold;
        this.italic = italic;
        this.underline = underline;
    }

    getCssStyles(): string {
        let fontWeight = this.bold ? TEXT_LAYER_BOLD_VALUE : TEXT_LAYER_REGULAR_VALUE;
        let fontStyle = this.italic ? 'italic' : 'normal'; // As the values wont change over time, we can hardcode them
        let textDecoration = this.underline ? 'underline' : 'none';
        return `position: absolute; left: ${this.x}px; top: ${
            this.y
        }px; z-index: ${this.zIndex}; opacity: ${this.opacity}; visibility: ${
            this.visible ? 'visible' : 'hidden'
        }; font-size: ${this.fontSize}px; color: ${
            this.fontColor
        }; font-family: ${
            this.fontFamily
        }; font-weight: ${fontWeight}; font-style: ${fontStyle}; text-decoration: ${textDecoration};`;
    }

    getContent(): string {
        return this.textContent;
    }
}
