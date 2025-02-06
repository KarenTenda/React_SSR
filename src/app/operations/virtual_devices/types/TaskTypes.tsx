export enum TaskTypes {
    INFERENCE = "inference",
    CHECKING = "checking",
    TRACKING = "tracking",
    SCANNING = "scanning",
}

export const taskTypeMap = [
    "inference",
    "checking",
    "tracking",
    "scanning",

]

export const badgeComponentTypeColorMap: { [key in TaskTypes]: string } = {
    [TaskTypes.INFERENCE]: "primary",
    [TaskTypes.CHECKING]: "secondary",
    [TaskTypes.TRACKING]: "success",
    [TaskTypes.SCANNING]: "warning",
};
  

export enum InferenceSpecificTypes {
    KEYPOINT = "keypoint",
    CLASSIFICATION = "classification",
    OBJECT = "object",
    SCANNING = "scanning",
}

export const inferenceSpecificTypeMap = [
    "keypoint",
    "classification",
    "object",
    "scanning",
]

export enum CheckingSpecificTypes {
    LABEL = "label",
    POINT_IN_REGION = "point_in_region",
    POSITIONAL_STATIC_REGION = "positional_static_region",
    POSITIONAL_DYNAMIC_REGION = "positional_dynamic_region",
    AGGREGATE = "aggregate",
}

export const checkingSpecificTypeMap = [
    "label",
    "point_in_region",
    "positional_static_region",
    "positional_dynamic_region",
    "aggregate",
]

export enum TrackingSpecificTypes {
    REFERENCE = "reference"
}

export const trackingSpecificTypeMap = [
    "reference",
]