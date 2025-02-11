import { v4 as uuidv4 } from 'uuid';
import { DataTypesColors, HandleInfo } from '../types/PinMetadataTypes';

export const EditorCanvasDefaultHandleData: {
    [key: string]: {
      inputs: number;
      outputs: number;
      inputHandles: HandleInfo[];
      outputHandles: HandleInfo[];
    };
  } = {
    'Camera Provider': {
        inputs: 1,
        outputs: 1,
        inputHandles: [],
        outputHandles: [
            {
                id: uuidv4(),
                type: 'source',
                datatype: 'string',
                dataTypeColor: 'string',
                data: { cameraId: '' },
            },
            {
                id: uuidv4(),
                type: 'source',
                datatype: 'ImageObject',
                dataTypeColor: 'ImageObject',
                data: { cameraObject: null },
            }
        ],
    },
    "Image Device": {
        inputs: 0,
        outputs: 3,
        inputHandles: [],
        outputHandles: [
            {
                id: uuidv4(),
                type: 'source',
                datatype: 'string',
                dataTypeColor: 'string',
                data: { cameraId: '' },
            },
            {
                id: uuidv4(),
                type: 'source',
                datatype: 'ImageObject',
                dataTypeColor: 'ImageObject',
                data: { cameraObject: null },
            },
            {
                id: uuidv4(),
                type: 'source',
                datatype: 'bytes',
                dataTypeColor: 'bytes',
                data: { cameraImage: '' },
            },
        ],
    },
    'Region Provider': {
        inputs: 1,
        outputs: 1,
        inputHandles: [],
        outputHandles: [
            {
                id: uuidv4(),
                type: 'source',
                datatype: 'string',
                dataTypeColor: 'string',
                data: { regionId: '', regionObject: null },
            },
        ],
    },
    'Model Provider': {
        inputs: 1,
        outputs: 1,
        inputHandles: [],
        outputHandles: [
            {
                id: uuidv4(),
                type: 'source',
                datatype: 'string',
                dataTypeColor: 'string',
                data: { modelId: '', modelObject: null },
            },
        ],
    },
    "Inference Device": {
        inputs: 3,
        outputs: 1,
        inputHandles: [
            {
                id: uuidv4(),
                type: 'target',
                datatype: 'ImageObject',
                dataTypeColor: 'ImageObject',
                data: { cameraObject: null },
            },
            {
                id: uuidv4(),
                type: 'target',
                datatype: 'string',
                dataTypeColor: 'string',
                data: { modelId: '', modelObject: null },
            },
            {
                id: uuidv4(),
                type: 'target',
                datatype: 'string',
                dataTypeColor: 'string',
                data: { regionId: '', regionObject: null },
            },
        ],
        outputHandles: [
            {
                id: uuidv4(),
                type: 'source',
                datatype: 'InferenceResult',
                dataTypeColor: 'InferenceResult',
                data: {
                    type: '',
                    results: [],
                    regionID: '',
                    cameraID: '',
                    modelID: '',
                },
            },
        ],
    },
    "Transform  Device": {
        inputs: 1,
        outputs: 1,
        inputHandles: [
            {
                id: uuidv4(),
                type: 'target',
                datatype: 'InferenceResult',
                dataTypeColor: 'InferenceResult',
            },
        ],
        outputHandles: [
            {
                id: uuidv4(),
                type: 'source',
                datatype: 'InferenceResult',
                dataTypeColor: 'InferenceResult',
            },
            {
                id: uuidv4(),
                type: 'source',
                datatype: 'boolean',
                dataTypeColor: 'boolean',
            },
        ],
    },
    "Communications Device": {
        inputs: 1,
        outputs: 1,
        inputHandles: [
            {
                id: uuidv4(),
                type: 'target',
                datatype: 'InferenceResult',
                dataTypeColor: 'InferenceResult',
                data: {
                    type: '',
                    results: [],
                    regionID: '',
                    cameraID: '',
                    modelID: '',
                },
            },
            {
                id: uuidv4(),
                type: 'target',
                datatype: 'boolean',
                dataTypeColor: 'boolean',
                data: false,
            }
        ],
        outputHandles: [
            {
                id: uuidv4(),
                type: 'source',
                datatype: 'string',
                dataTypeColor: 'string',
                data: '',
            },
        ],
    },
    Condition: {
        inputs: 1,
        outputs: 2,
        inputHandles: [
            {
                id: uuidv4(),
                type: 'target',
                datatype: 'boolean',
                dataTypeColor: 'boolean',
            },
        ],
        outputHandles: [
            {
                id: uuidv4(),
                type: 'source',
                datatype: 'boolean',
                dataTypeColor: 'boolean',
            },
            {
                id: uuidv4(),
                type: 'source',
                datatype: 'boolean',
                dataTypeColor: 'boolean',
            },
        ],
    },
    AI: {
        inputs: 2,
        outputs: 1,
        inputHandles: [
            {
                id: uuidv4(),
                type: 'target',
                datatype: 'string',
                dataTypeColor: 'string',
            },
            {
                id: uuidv4(),
                type: 'target',
                datatype: 'object',
                dataTypeColor: 'object',
            },
        ],
        outputHandles: [
            {
                id: uuidv4(),
                type: 'source',
                datatype: 'string',
                dataTypeColor: 'string',
            },
        ],
    },
    Interval: {
        inputs: 0,
        outputs: 1,
        inputHandles: [],
        outputHandles: [
            {
                id: uuidv4(),
                type: 'source',
                datatype: 'string',
                dataTypeColor: 'string',
            },
        ],
    },
    'Google Drive': {
        inputs: 1,
        outputs: 1,
        inputHandles: [
            {
                id: uuidv4(),
                type: 'target',
                datatype: 'string',
                dataTypeColor: 'string',
            },
        ],
        outputHandles: [
            {
                id: uuidv4(),
                type: 'source',
                datatype: 'string',
                dataTypeColor: 'string',
            },
        ],
    },
    Count: {
        inputs: 1,
        outputs: 1,
        inputHandles: [
            {
                id: uuidv4(),
                type: 'target',
                datatype: 'number',
                dataTypeColor: 'number',
            },
        ],
        outputHandles: [
            {
                id: uuidv4(),
                type: 'source',
                datatype: 'number',
                dataTypeColor: 'number',
            },
        ],
    },
    Trigger: {
        inputs: 0,
        outputs: 1,
        inputHandles: [],
        outputHandles: [
            {
                id: uuidv4(),
                type: 'source',
                datatype: 'any',
                dataTypeColor: 'any',
            },
        ],
    },
    Action: {
        inputs: 1,
        outputs: 0,
        inputHandles: [
            {
                id: uuidv4(),
                type: 'target',
                datatype: 'any',
                dataTypeColor: 'any',
            },
        ],
        outputHandles: [],
    },
    Wait: {
        inputs: 1,
        outputs: 1,
        inputHandles: [
            {
                id: uuidv4(),
                type: 'target',
                datatype: 'any',
                dataTypeColor: 'any',
            },
        ],
        outputHandles: [
            {
                id: uuidv4(),
                type: 'source',
                datatype: 'any',
                dataTypeColor: 'any',
            },
        ],
    },
};
