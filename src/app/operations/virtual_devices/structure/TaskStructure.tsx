import { TaskTypes } from "../types/TaskTypes";

export class TaskStructure {
    id: string;
    type: TaskTypes;
    specific_type: string;
    camera_id?: string;
  
    constructor(
      id: string,
      type: TaskTypes,
      specific_type: string,
      camera_id?: string
    ) {
      this.id = id;
      this.type = type;
      this.specific_type = specific_type;
      this.camera_id = camera_id;
    }
}

