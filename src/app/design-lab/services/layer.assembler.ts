import { ImageContent, Layer, TextContent } from '../model/layer.entity';
import { LayerResponse } from './project.response';

export class LayerAssembler {
    static toEntityFromResponse(response: LayerResponse): Layer {
        const content = response.content;
        const layer = {
            id: response.id,
            canvasId: response.canvas_id,
            type: response.type,
            zIndex: response.z_index,
            isVisible: response.is_visible,
            createdAt: new Date(response.created_at),
            lastModified: new Date(response.last_modified),
        };

        const layerContent: any = {
            x: content.x || 0,
            y: content.y || 0,
            rotation: content.rotation || 0,
            opacity: content.opacity || 1,
        };

        if (response.type === 'image') {
            layerContent.imageUrl = content.image_url || '';
            layerContent.width = content.width || 0;
            layerContent.height = content.height || 0;
            layerContent.scale = content.scale || 1;
            layerContent.maintainAspectRatio =
                content.maintain_aspect_ratio || false;

            return {
                ...layer,
                content: layerContent as ImageContent,
            };
        } else if (response.type === 'text') {
            layerContent.text = content.text || '';
            layerContent.fontFamily = content.font_family || '';
            layerContent.fontSize = content.font_size || 0;
            layerContent.fontWeight = content.font_weight || 0;
            layerContent.color = content.color || '';
            layerContent.textAlign = content.text_align || 'left';
            return {
                ...layer,
                content: layerContent as TextContent,
            };
        }

        throw new Error(`Unknown layer type: ${response.type}`);
    }

    static toEntitiesFromResponse(response: LayerResponse[]): Layer[] {
        return response.map((layerResponse) => {
            return LayerAssembler.toEntityFromResponse(layerResponse);
        });
    }
}