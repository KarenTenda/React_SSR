import { TaskStructure } from "../TaskStructure";
import { TaskTypes, InferenceSpecificTypes } from "../../types/TaskTypes";
import { PipelineElement } from "./ResultPipelineElements";

export class ClientConfig {
    adapter_id: string;
    adapter_name: string;
    host: string;
    port: number;
    timeout: number;

    constructor(adapterId: string, adapterName: string, host: string, port: number, timeout: number) {
        this.adapter_id = adapterId;
        this.adapter_name = adapterName;
        this.host = host;
        this.port = port;
        this.timeout = timeout;
    }
}

export class visualizerConfig {
    visualize: boolean;
    show_confidence?: boolean;
    show_class_label?: boolean;
    class_label_to_color_map?: { [key: string]: number[] };
    class_label_to_display_name_map?: { [key: string]: number[] };

    constructor(
        visualize: boolean,
        show_confidence?: boolean,
        show_class_label?: boolean,
        class_label_to_color_map?: { [key: string]: number[] },
        class_label_to_display_name_map?: { [key: string]: number[] }
    ) {
        this.visualize = visualize;
        this.show_confidence = show_confidence;
        this.show_class_label = show_class_label;
        this.class_label_to_color_map = class_label_to_color_map;
        this.class_label_to_display_name_map = class_label_to_display_name_map;
    }
}

export class InferenceTask extends TaskStructure {
    camera_id: string;
    client_config: ClientConfig;
    result_processing_pipeline: PipelineElement[];
    id_assignment_model: { value: string };
    model_id: string;
    reference_region_ids: string[];
    result_handler_model: { handler_type: string };
    visualizer: visualizerConfig;

    constructor(
        id: string,
        type: TaskTypes.INFERENCE,
        specificType: InferenceSpecificTypes.KEYPOINT | InferenceSpecificTypes.CLASSIFICATION,
        cameraId: string,
        clientConfig: ClientConfig,
        resultProcessingPipeline: PipelineElement[],
        idAssignmentModel: { value: string },
        modelId: string,
        referenceRegionIds: string[],
        resultHandlerModel: { handler_type: string },
        visualizer: visualizerConfig
    ) {
        super(id, type, specificType);
        this.camera_id = cameraId;
        this.client_config = clientConfig;
        this.result_processing_pipeline = resultProcessingPipeline;
        this.id_assignment_model = idAssignmentModel;
        this.model_id = modelId;
        this.reference_region_ids = referenceRegionIds;
        this.result_handler_model = resultHandlerModel;
        this.visualizer = visualizer;
    }
}
