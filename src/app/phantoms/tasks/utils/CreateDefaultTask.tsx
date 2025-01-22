import { InferenceTask, visualizerConfig, ClientConfig } from "../structure/inference/InferenceStructure";
import { TaskTypes, InferenceSpecificTypes, CheckingSpecificTypes } from "../types/TaskTypes";
import { CheckingTask,CheckingConfig } from "../structure/CheckingStructure";

export function createDefaultInferenceTask(): InferenceTask {
  return new InferenceTask(
    "default-id", 
    TaskTypes.INFERENCE, 
    InferenceSpecificTypes.KEYPOINT,
    "default-camera-id", 
    new ClientConfig(
      "default-adapter-id",
      "default-adapter-name",
      "127.0.0.1",
      8080,
      5000 
    ),
    [], 
    { value: "default-value" },
    "default-model-id",
    [], 
    { handler_type: "default-handler" }, 
    new visualizerConfig(
      false, 
      true,
      true, 
      {}, 
      {} 
    )
  );
}



export function createDefaultCheckingTask(): CheckingTask {
  const defaultCheckingConfig = new CheckingConfig(
    "default-checking-config-id", // Config ID
    "default-inference-id", // Reference Component ID
    "default-result-id", // Reference Component Result ID
    "default-target-label", // Target Label
    5000 // Timeout in milliseconds (optional)
  );

  return new CheckingTask(
    "default-checking-task-id", // Task ID
    TaskTypes.CHECKING, // Task type
    CheckingSpecificTypes.LABEL, // Default specific type
    "default-camera-id", // Camera ID
    [defaultCheckingConfig], // Array of CheckingConfig
    { handler_type: "default-handler" } // Default result handler model
  );
}

