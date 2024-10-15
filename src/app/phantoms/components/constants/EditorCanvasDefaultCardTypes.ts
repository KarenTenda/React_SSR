

export const EditorCanvasDefaultCardTypes = {
    Camera: { 
        description: 'Returns image data in different formats from a camera.', 
        type: 'Action' 
    },
    "Region Provider": {
      description:
        'Shows the region of interest in the image or video.',
      type: 'Action',
    },
    Inference: {
      description: 'Returns inference data from a model.',
      type: 'Action',
    },
    'Model Provider': {
      description: 'Returns a Model ID for the model of interest',
      type: 'Action',
    },
    Communications: {
        description: 'This converts data to kto, vios, or any other format.',
        type: 'Action',
    },
    Transform: {
        description: 'Convert or return original data.',
        type: 'Action',
    },
    Condition: {
      description: 'Boolean operator that creates different conditions lanes.',
      type: 'Action',
    },
    AI: {
      description:
        'Use the power of AI to create custom nodes.',
      type: 'Action',
    },
    Interval: { 
        description: 'Date and time intervals based triggers.', 
        type: 'Action' 
    },
    'Google Drive': {
      description:
        'Connect with Google drive to trigger actions or to create files and folders.',
      type: 'Trigger',
    },
    Count: { 
        description: 'Count the number of times an event occurs.', 
        type: 'Action' 
    },
    Trigger: {
      description: 'An event that starts the workflow.',
      type: 'Trigger',
    },
    Action: {
      description: 'An event that happens after the workflow begins',
      type: 'Action',
    },
    Wait: {
      description: 'Delay the next action step by using the wait timer.',
      type: 'Action',
    },
  }