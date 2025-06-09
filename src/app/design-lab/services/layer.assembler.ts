import { DEFAULT_LAYER_STYLES } from "../../const";
import { ImageLayer, Layer, TextLayer } from "../model/layer.entity";
import { LayerResponse } from "./project.response";

export class LayerAssembler {

    static toEntityFromResponse(response: LayerResponse) : Layer {
        if (response.type === 'image') {
            return new ImageLayer(
                response.id,
                response.x,
                response.y,
                response.z_index,
                response.opacity,
                response.visible,
                response.image_url || ''
            );
        } else if (response.type === 'text') {
            return new TextLayer(
                response.id,
                response.x,
                response.y,
                response.z_index,
                response.opacity,
                response.visible,
                response.text_content || '',
                response.font_size || DEFAULT_LAYER_STYLES.FONT_SIZE,
                response.font_color || DEFAULT_LAYER_STYLES.FONT_COLOR,
                response.font_family || DEFAULT_LAYER_STYLES.FONT_FAMILY,
                response.bold || DEFAULT_LAYER_STYLES.BOLD,
                response.italic || DEFAULT_LAYER_STYLES.ITALIC,
                response.underline || DEFAULT_LAYER_STYLES.UNDERLINE
            );
        } else {
            throw new Error(`Unknown layer type: ${response.type}`);
        }
    }

    static toEntitiesFromResponse(responses: LayerResponse[]) : Layer[] {
        return responses.map(response => LayerAssembler.toEntityFromResponse(response));
    }
}
