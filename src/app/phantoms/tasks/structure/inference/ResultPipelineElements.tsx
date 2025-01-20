export abstract class PipelineElement {
    type: string;
    configs: any;

    constructor(type: string) {
        this.type = type;
    }
}

export const allPipelineElementTypes = [
    "denormalize_transform",
    "keypoint_index_filter",
    "homography_matrix_transform",
    "keypoint_exclude_filter",
    "result_keypoint_range_filter",
    "result_confidence_filter",
    "result_region_filter",
    "result_box_collider_filter",
    "result_point_distance_measurement_filter",
    "result_extraction_by_attribute_action"
];

export class KeypointIndexFilter extends PipelineElement {
    wanted_indices: number[];
    target_result_id?: string;
    resulting_id?: string;

    constructor(wanted_indices: number[], target_result_id?: string, resulting_id?: string) {
        super("keypoint_index_filter");
        this.wanted_indices = wanted_indices;
        this.target_result_id = target_result_id;
        this.resulting_id = resulting_id;
    }
}

export class KeypointExcludeFilter extends PipelineElement {
    points_to_exclude: number[];
    target_result_id?: string;
    resulting_id?: string;

    constructor(points_to_exclude: number[], target_result_id?: string, resulting_id?: string) {
        super("keypoint_exclude_filter");
        this.points_to_exclude = points_to_exclude;
        this.target_result_id = target_result_id;
        this.resulting_id = resulting_id;
    }
}

export class ResultKeypointRangeFilter extends PipelineElement {
    x_range: [number, number];
    y_range: [number, number];
    target_result_id?: string;
    resulting_id?: string;

    constructor(x_range: [number, number], y_range: [number, number], target_result_id?: string, resulting_id?: string) {
        super("result_keypoint_range_filter");
        this.x_range = x_range;
        this.y_range = y_range;
        this.target_result_id = target_result_id;
        this.resulting_id = resulting_id;
    }
}

export class ResultConfidenceFilter extends PipelineElement {
    confidence_threshold: number;
    target_result_id?: string;
    resulting_id?: string;

    constructor(confidence_threshold: number, target_result_id?: string, resulting_id?: string) {
        super("result_confidence_filter");
        this.confidence_threshold = confidence_threshold;
        this.target_result_id = target_result_id;
        this.resulting_id = resulting_id;
    }
}

export class ResultRegionFilter extends PipelineElement {
    region_id: string;
    target_result_id?: string;
    resulting_id?: string;

    constructor(region_id: string, target_result_id?: string, resulting_id?: string) {
        super("result_region_filter");
        this.region_id = region_id;
        this.target_result_id = target_result_id;
        this.resulting_id = resulting_id;
    }
}

export class DenormalizeTransform extends PipelineElement {
    target_result_id?: string;
    resulting_id?: string;

    constructor(target_result_id?: string, resulting_id?: string) {
        super("denormalize_transform");
        this.target_result_id = target_result_id;
        this.resulting_id = resulting_id;
    }
}

export class GlobalCoordinatesTransform extends PipelineElement {
    target_result_id?: string;
    resulting_id?: string;

    constructor(target_result_id?: string, resulting_id?: string) {
        super("global_coordinates_transform");
        this.target_result_id = target_result_id;
        this.resulting_id = resulting_id;
    }
}

export class ResultExtractionByAtrributeValueActionConfigModel {
    attribute_name: string;
    attribute_value: string;
    resulting_id: string;
    target_result_id?: string;

    constructor(attribute_name: string, attribute_value: string, resulting_id: string, target_result_id?: string) {
        this.attribute_name = attribute_name;
        this.attribute_value = attribute_value;
        this.resulting_id = resulting_id;
        this.target_result_id = target_result_id;
    }
}

export class ResultExtractionByAttributeAction extends PipelineElement {
    configs: ResultExtractionByAtrributeValueActionConfigModel[];

    constructor(configs: ResultExtractionByAtrributeValueActionConfigModel[]) {
        super("result_extraction_by_attribute_action");
        this.configs = configs;
    }
}

export class LinearScalingConfigModel {
    type: string;
    interval: number[];
    coefficient?: number;
    offset?: number;

    constructor(type: string, interval: number[], coefficient: number, offset: number) {
        this.type = type;
        this.interval = interval;
        this.coefficient = coefficient;
        this.offset = offset;
    }
}

export class ErrorCorrectionScalingConfigModel {
    type: string;
    interval: number[];
    start_error?: number;
    end_error?: number;

    constructor(type: string, interval: number[], start_error: number, end_error: number) {
        this.type = type;
        this.interval = interval;
        this.start_error = start_error;
        this.end_error = end_error;
    }
}

export class HomographyMatrixTransformConfigModel {
    target_result_id: string;
    resulting_id: string;
    homography_id: string;
    invert_coordinates: boolean;
    multiplication_factors?: number[];
    x_scaling?: ErrorCorrectionScalingConfigModel[] | LinearScalingConfigModel[];
    y_scaling?: ErrorCorrectionScalingConfigModel[] | LinearScalingConfigModel[];
    constructor(target_result_id: string, 
        resulting_id: string, 
        homography_id: string, 
        invert_coordinates: boolean, 
        multiplication_factors?: number[],
        x_scaling?: ErrorCorrectionScalingConfigModel[] | LinearScalingConfigModel[], 
        y_scaling?: ErrorCorrectionScalingConfigModel[] | LinearScalingConfigModel[]) 
        {
        this.target_result_id = target_result_id;
        this.resulting_id = resulting_id;
        this.homography_id = homography_id;
        this.invert_coordinates = invert_coordinates;
        this.multiplication_factors = multiplication_factors;
        this.x_scaling = x_scaling;
        this.y_scaling = y_scaling;
    }
}

export class HomographyMatrixTransform extends PipelineElement {
    configs: HomographyMatrixTransformConfigModel[];

    constructor(configs: HomographyMatrixTransformConfigModel[]) {
        super("homography_matrix_transform");
        this.configs = configs;
    }
}

export class ResultBoxColliderFilterConfigModel {
    target_result_id: string;
    target_result_sub_ids: string[];
    attribute_name: string;
    attribute_value: string;
    collider_offset: number;
    collider_type: string;
    positive_x_dim: number;
    negative_x_dim: number;
    positive_y_dim: number;
    negative_y_dim: number;

    constructor(target_result_id: string, target_result_sub_ids: string[], attribute_name: string, attribute_value: string, collider_offset: number, collider_type: string, positive_x_dim: number, negative_x_dim: number, positive_y_dim: number, negative_y_dim: number) {
        this.target_result_id = target_result_id;
        this.target_result_sub_ids = target_result_sub_ids;
        this.attribute_name = attribute_name;
        this.attribute_value = attribute_value;
        this.collider_offset = collider_offset;
        this.collider_type = collider_type;
        this.positive_x_dim = positive_x_dim;
        this.negative_x_dim = negative_x_dim;
        this.positive_y_dim = positive_y_dim;
        this.negative_y_dim = negative_y_dim;
    }
}

export class ResultBoxColliderFilter extends PipelineElement {
    configs: ResultBoxColliderFilterConfigModel[];

    constructor(configs: ResultBoxColliderFilterConfigModel[]) {
        super("result_box_collider_filter");
        this.configs = configs;
    }
}

export class ResultPointDistanceMeasurementFilterConfigModel {
    target_result_id: string;
    target_result_sub_ids: string[];
    target_distance: number;
    distance_tolerance: number;

    constructor(target_result_id: string, target_result_sub_ids: string[], target_distance: number, distance_tolerance: number) {
        this.target_result_id = target_result_id;
        this.target_result_sub_ids = target_result_sub_ids;
        this.target_distance = target_distance;
        this.distance_tolerance = distance_tolerance;
    }
}

export class ResultPointDistanceMeasurementFilter extends PipelineElement {
    configs: ResultPointDistanceMeasurementFilterConfigModel[];

    constructor(configs: ResultPointDistanceMeasurementFilterConfigModel[]) {
        super("result_point_distance_measurement_filter");
        this.configs = configs;
    }
}

// export class ResultProcessingPipeline [
//     DenormalizeTransform,
//     GlobalCoordinatesTransform,
//     HomographyMatrixTransform,

//     KeypointIndexFilter,
//     KeypointExcludeFilter,
//     ResultKeypointRangeFilter,
//     ResultConfidenceFilter,
//     ResultRegionFilter,
//     ResultBoxColliderFilter,
//     ResultPointDistanceMeasurementFilter,
    
//     ResultExtractionByAttributeAction,
    
// ]


