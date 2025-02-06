import React from 'react';
import { EditorNodeType } from '../../../types/EditorCanvasTypes';
import { HandleInfo, ModelProviderOutputData } from '../../../types/PinMetadataTypes';

const ModelProviderNodeSetUp = ({
    selectedNode,
    onUpdate,
}: {
    selectedNode: EditorNodeType;
    onUpdate: (updatedNode: EditorNodeType) => void;
}) => {
    const selectedHandle: HandleInfo | undefined = selectedNode.data.metadata.selectedHandle;
    
    if (!selectedHandle) {
        return <div>Error: selectedHandle is undefined</div>;
    }

    const handledata: ModelProviderOutputData = selectedHandle.data as ModelProviderOutputData;

    const handleModelIDChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        const modelID = event.target.value;
        const modelObject = { id: modelID, name: `Model ${modelID}` }; // Example model object

        // Update the outputHandles array, ensuring that the correct handle is updated
        const updatedOutputHandles = selectedNode.data.metadata.outputHandles?.map((handle) =>
            handle.id === selectedHandle.id
                ? {
                    ...handle,
                    data: {
                        ...handledata,
                        modelId: modelID,
                        modelObject: modelObject, // Update modelObject based on modelID
                    }
                }
                : handle
        );

        // Call onUpdate to update the node
        onUpdate({
            ...selectedNode,
            data: {
                ...selectedNode.data,
                metadata: {
                    ...selectedNode.data.metadata,
                    outputHandles: updatedOutputHandles, // Update the outputHandles with the new model data
                },
            },
        });
    };

    return (
        <div>
            <label>Model ID</label>
            <select
                value={handledata.modelId}
                onChange={handleModelIDChange}
            >
                <option value="model1">Model 1</option>
                <option value="model2">Model 2</option>
                <option value="model3">Model 3</option>
            </select>
        </div>
    );
};

export default ModelProviderNodeSetUp;
