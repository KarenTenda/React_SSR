import { CameraStructure } from "@/app/cameras/structure/CameraStructure";

export type CameraNodeOutputData =
    | { cameraId: string }  
    | { cameraObject: CameraStructure }  
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

export type DataTypes = 
    | 'string' 
    | 'number' 
    | 'boolean' 
    | 'object' 
    | 'array' 
    | 'any' 
    | 'bytes' 
    | 'ImageObject'
    

export type HandleTypes = 'source' | 'target';

export const DataTypesColors = {
    'string': '#FFC107',
    'number': '#673AB7',
    'boolean': '#4CAF50',
    'object': '#FF5722',
    'array': '#2196F3',
    'bytes': '#795548',
    'any': '#607D8B',
    'ImageObject': '#FFEB3B',
};

export type HandleMetadata = 
    | CameraNodeOutputData
    | ModelProviderOutputData
    | RegionProviderOutputData
    | InferenceResultMetadata;

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
