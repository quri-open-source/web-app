
export const DEFAULT_LAYER_STYLES = {
    IMAGE_URL : '', // TODO: Add default image url
    TEXT_CONTENT : '', // TODO: Add default text content
    FONT_SIZE : 16,
    FONT_COLOR : '#000000',
    FONT_FAMILY : 'Arial',
    BOLD : false,
    ITALIC : false,
    UNDERLINE : false,
}

export const TEXT_LAYER_BOLD_VALUE = '700';
export const TEXT_LAYER_REGULAR_VALUE = '400';

export enum PROJECT_STATUS {
    IN_PROGRESS = 'in progress',
    BLUEPRINT = 'blueprint',
    COMPLETED = 'completed',
}

export enum PROJECT_GENDER {
    MEN = 'men',
    WOMEN = 'women',
    UNISEX = 'unisex',
    KIDS = 'kids',
}

export enum GARMENT_COLOR {
    BLACK = '#161615',
    GRAY = '#403D3B',
    LIGHT_GRAY = '#B3B1AF',
    WHITE = '#EDEDED',
    RED = '#B51B14',
    PINK = '#F459B0',
    LIGHT_PURPLE = '#D890E4',
    PURPLE = '#693FA0',
    LIGHT_BLUE = '#00A5BC',
    CYAN = '#31B7C9',
    SKY_BLUE = '#3F9BDC',
    BLUE = '#1B3D92',
    GREEN = '#1B8937',
    LIGHT_GREEN = '#5BBE65',
    YELLOW = '#FECD08',
    DARK_YELLOW = '#F2AB00',
}

export enum GARMENT_SIZE {
    XS = 'XS',
    S = 'S',
    M = 'M',
    L = 'L',
    XL = 'XL',
    XXL = 'XXL',
}

export enum LayerType {
    IMAGE = 'image',
    TEXT = 'text',
}
