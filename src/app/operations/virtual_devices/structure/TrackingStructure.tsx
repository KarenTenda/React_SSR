import { TaskTypes, TrackingSpecificTypes } from "../types/TaskTypes";
import { TaskStructure } from "./TaskStructure";

export class TrackingConfig {
    id: string;
    reference_component_id: string;
    reference_component_result_id: string;
    reference_component_sub_id: string;
    target_component_id: string;
    target_component_result_id: string;
    target_component_result_sub_ids: string[];

    constructor(id: string, 
        reference_component_id: string,
        reference_component_result_id: string,
        reference_component_sub_id: string,
        target_component_id: string, 
        target_component_result_id: string, 
        target_component_result_sub_ids: string[]) 
        {
        this.id = id;
        this.reference_component_id = reference_component_id;
        this.reference_component_result_id = reference_component_result_id;
        this.reference_component_sub_id = reference_component_sub_id;
        this.target_component_id = target_component_id;
        this.target_component_result_id = target_component_result_id;
        this.target_component_result_sub_ids = target_component_result_sub_ids;
    }
}

export class TrackingTask extends TaskStructure {
    tracking_configs: TrackingConfig[];
    result_handler_model: { handler_type: string };

    constructor(
        id: string,
        type: TaskTypes.TRACKING,
        specific_type: TrackingSpecificTypes,
        tracking_configs: TrackingConfig[],
        resultHandlerModel: { handler_type: string }
    ) {
        super(id, type, specific_type);
        this.tracking_configs = tracking_configs;
        this.result_handler_model = resultHandlerModel;
    }
}