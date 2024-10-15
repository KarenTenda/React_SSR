import React, { useState, useEffect } from 'react';
import { EditorNodeType } from '../../../types/EditorCanvasTypes';
import { InferenceResultMetadata, NodeMetadata, HandleInfo } from '../../../types/PinMetadataTypes';

const InferenceNodeSetUp = ({
    selectedNode,
    onUpdate,
}: {
    selectedNode: EditorNodeType;
    onUpdate: (updatedNode: EditorNodeType) => void;
}) => {
    const [currentStep, setCurrentStep] = useState(0);  
    const [inferenceType, setInferenceType] = useState<string>('');  
    const [modelID, setModelID] = useState<string>(''); 
    const [threshold, setThreshold] = useState<number>(0.5); 
    const [cameraID, setCameraID] = useState<string>('');  
    const [regionID, setRegionID] = useState<string>(''); 

    const steps = [
        'Select Inference Type',
        'Configure Inference Settings',
        'Review & Finish',
    ];

    // Load input data from connected nodes (e.g., Camera, Region, Model)
    useEffect(() => {
        const inputHandles: HandleInfo[] = selectedNode.data.metadata.inputHandles || [];
        
        // Assuming the inputHandles provide the necessary cameraID, regionID, and modelID
        const cameraInput = inputHandles.find(handle => handle.datatype === 'ImageObject');
        const regionInput = inputHandles.find(handle => handle.datatype === 'string'); // Example for regionID
        const modelInput = inputHandles.find(handle => handle.datatype === 'string' && handle.data?.modelId);

        if (cameraInput?.data) {
            setCameraID(cameraInput.data.cameraId);
        }
        if (regionInput?.data) {
            setRegionID(regionInput.data.regionId);
        }
        if (modelInput?.data) {
            setModelID(modelInput.data.modelId);
        }
    }, [selectedNode.data.metadata.inputHandles]);

    // Step 1: Selecting the Inference Type
    const handleInferenceTypeChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        setInferenceType(event.target.value);
    };

    // Step 2: Setting Model ID, Threshold, or Other Parameters
    const handleModelIDChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setModelID(event.target.value);
    };

    const handleThresholdChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setThreshold(Number(event.target.value));
    };

    // Step 3: Submit the Configuration
    const handleSubmit = () => {
        const updatedMetadata: InferenceResultMetadata = {
            ...selectedNode.data.metadata,
            type: inferenceType,
            results: [], // This will hold inference results once the model is run
            regionID: regionID, // Get regionID from connected node
            cameraID: cameraID, // Get cameraID from connected node
            modelID: modelID,  // Get modelID from connected node or user input
        };

        // Update the node with new metadata
        onUpdate({
            ...selectedNode,
            data: {
                ...selectedNode.data,
                metadata: updatedMetadata,
            },
        });
    };

    // Navigation controls
    const goNext = () => setCurrentStep((prevStep) => Math.min(prevStep + 1, steps.length - 1));
    const goBack = () => setCurrentStep((prevStep) => Math.max(prevStep - 1, 0));

    return (
        <div className="inference-setup">
            <h3>{steps[currentStep]}</h3>
            
            {currentStep === 0 && (
                <>
                    <label htmlFor="inference-type">Select Inference Type:</label>
                    <select id="inference-type" value={inferenceType} onChange={handleInferenceTypeChange}>
                        <option value="">-- Select --</option>
                        <option value="keypoint">Keypoint Detection</option>
                        <option value="classification">Classification</option>
                        <option value="object-detection">Object Detection</option>
                    </select>
                </>
            )}

            {currentStep === 1 && (
                <>
                    {inferenceType === 'classification' && (
                        <>
                            <label htmlFor="model-id">Model ID:</label>
                            <input id="model-id" value={modelID} onChange={handleModelIDChange} />
                        </>
                    )}

                    {inferenceType === 'object-detection' && (
                        <>
                            <label htmlFor="threshold">Detection Threshold:</label>
                            <input
                                id="threshold"
                                type="range"
                                min="0"
                                max="1"
                                step="0.01"
                                value={threshold}
                                onChange={handleThresholdChange}
                            />
                            <span>{threshold}</span>
                        </>
                    )}

                    {inferenceType === 'keypoint' && (
                        <div>
                            <p>Configure keypoint detection settings (e.g., body pose, etc.)</p>
                        </div>
                    )}
                </>
            )}

            {currentStep === 2 && (
                <div>
                    <p>Review your settings:</p>
                    <p><strong>Type:</strong> {inferenceType}</p>
                    <p><strong>Model ID:</strong> {modelID}</p>
                    <p><strong>Camera ID:</strong> {cameraID}</p>
                    <p><strong>Region ID:</strong> {regionID}</p>
                    <p><strong>Threshold:</strong> {threshold}</p>
                </div>
            )}

            <div className="navigation-buttons">
                {currentStep > 0 && <button onClick={goBack}>Back</button>}
                {currentStep < steps.length - 1 && <button onClick={goNext}>Next</button>}
                {currentStep === steps.length - 1 && <button onClick={handleSubmit}>Finish</button>}
            </div>
        </div>
    );
};

export default InferenceNodeSetUp;
