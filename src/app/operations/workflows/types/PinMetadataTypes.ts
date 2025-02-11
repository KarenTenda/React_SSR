import { CameraStructure } from "@/app/cameras/structure/CameraStructure";

export type DataTypes =
    | 'string'
    | 'number'
    | 'boolean'
    | 'object'
    | 'array'
    | 'any'
    | 'bytes'
    | 'ImageObject'
    | 'InferenceResult';


export type HandleTypes = 'source' | 'target';

export const DataTypesColors = {
    'string': '#4287f5',       // Gold
    'number': '#8E44AD',       // Deep Purple
    'boolean': '#27AE60',      // Emerald Green
    'object': '#E74C3C',       // Soft Red
    'array': '#2980B9',        // Bright Blue
    'bytes': '#D35400',        // Dark Orange
    'any': '#95A5A6',          // Neutral Gray
    'ImageObject': '#F1C40F',  // Bright Yellow
    'InferenceResult': '#F39C12', // Golden Orange
};

export type CameraProviderOutputData = {
    cameraId: string;
    cameraObject: CameraStructure | null;
}

export type ImageNodeOutputData =
    | { cameraId: string }
    | { cameraObject: CameraStructure | null }
    | { cameraImage: string };

export type ModelProviderOutputData = {
    modelId: string;
    modelObject: any;
}

export type RegionProviderOutputData = {
    regionId: string;
    regionObject: any;
}

export type InferenceResultMetadata = {
    type: string
    results: []
    regionID: string
    cameraID: string
    modelID: string
}

export type HandleMetadata =
    | CameraProviderOutputData
    | ImageNodeOutputData
    | ModelProviderOutputData
    | RegionProviderOutputData
    | InferenceResultMetadata
    | boolean
    | string;

export type HandleInfo = {
    id: string;
    type: HandleTypes;
    datatype: DataTypes;
    dataTypeColor: keyof typeof DataTypesColors;
    data?: HandleMetadata;
    settings?: {
        immutable: boolean;
    }
}

export type Metadata = {
    inputs: number;
    outputs: number;
    selectedHandle?: HandleInfo;
    inputHandles?: HandleInfo[];
    outputHandles?: HandleInfo[];
}

export type ActionNodeMetadata = Metadata & {
    actionSpecificData: string;
}

export type TriggerNodeMetadata = Metadata & {
    triggerValue: string;
    debounce: number;
}

export type ConditionNodeMetadata = Metadata & {
    conditionExpression: string;
}

export type NodeMetadata =
    | Metadata
    | ActionNodeMetadata
    | TriggerNodeMetadata
    | ConditionNodeMetadata
