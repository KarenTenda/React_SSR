
import { TaskStructure } from "./TaskStructure";
import { TaskTypes, CheckingSpecificTypes } from "../types/TaskTypes";

export class CheckingConfig {
    id: string;
    reference_component_id: string;
    reference_component_result_id: string;
    target_label: string;
    timeout?: number;

    constructor(id: string, reference_component_id: string, reference_component_result_id: string, target_label: string, timeout?: number) {
        this.id = id;
        this.reference_component_id = reference_component_id;
        this.reference_component_result_id = reference_component_result_id;
        this.target_label = target_label;
        this.timeout = timeout;
    }
}

export class CheckingTask extends TaskStructure {
    camera_id: string;
    checking_configs: CheckingConfig[];
    result_handler_model: { handler_type: string };
    
    constructor(
        id: string,
        type: TaskTypes.CHECKING,
        specific_type: CheckingSpecificTypes,
        camera_id: string,
        checking_configs: CheckingConfig[],
        result_handler_model: { handler_type: string },
        
    ) {
        super(id, type, specific_type);
        this.camera_id = camera_id;
        this.checking_configs = checking_configs;
        this.result_handler_model = result_handler_model;   
    }
}
