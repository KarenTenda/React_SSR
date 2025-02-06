import { CheckingTask } from "../structure/CheckingStructure";
import { InferenceTask } from "../structure/inference/InferenceStructure";
import { TaskStructure } from "../structure/TaskStructure";
import { TrackingTask } from "../structure/TrackingStructure";
import { TaskTypes } from "../types/TaskTypes";

export function resolveCameraId(task: TaskStructure, tasks: TaskStructure[]): string | null {
    // console.log('task', task);
    switch (task.type) {
        case TaskTypes.INFERENCE:
            return (task as InferenceTask).camera_id || null;
        case TaskTypes.CHECKING: {
            const checkingTask = task as CheckingTask; 
            if (checkingTask) {
                const referencedInference = tasks.find(
                    t => t.id === checkingTask.checking_configs[0].reference_component_id
                ) as InferenceTask;
                // console.log('referencedInference', referencedInference);
                return referencedInference?.camera_id || null; 
            }
            return null;
        }
            case TaskTypes.TRACKING:
                const trackingTask = task as TrackingTask;
                if (trackingTask && trackingTask.tracking_configs?.length > 0) {
                    const referencedInference = tasks.find(
                        t => t.id === trackingTask.tracking_configs[0].target_component_id
                    ) as InferenceTask | undefined;
                    if (referencedInference && referencedInference.type === TaskTypes.INFERENCE) {
                        return referencedInference.camera_id || null;
                    }
                    return referencedInference?.camera_id || null; 
                }
                return null;
        default:
            return null;
    }
}
