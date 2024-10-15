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
    Camera: {
        inputs: 0,
        outputs: 3,
        inputHandles: [],
        outputHandles: [
            {
                id: uuidv4(),
                type: 'source',
                datatype: 'string',
                dataTypeColor: 'string',
            },
            {
                id: uuidv4(),
                type: 'source',
                datatype: 'ImageObject',
                dataTypeColor: 'ImageObject',
            },
            {
                id: uuidv4(),
                type: 'source',
                datatype: 'bytes',
                dataTypeColor: 'bytes',
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
            },
        ],
    },
    Inference: {
        inputs: 3,
        outputs: 1,
        inputHandles: [
            {
                id: uuidv4(),
                type: 'target',
                datatype: 'ImageObject',
                dataTypeColor: 'ImageObject',
            },
            {
                id: uuidv4(),
                type: 'target',
                datatype: 'string',
                dataTypeColor: 'string',
            },
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
                datatype: 'boolean',
                dataTypeColor: 'boolean',
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
            },
        ],
    },
    Communications: {
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
    Transform: {
        inputs: 1,
        outputs: 1,
        inputHandles: [
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
                datatype: 'object',
                dataTypeColor: 'object',
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
