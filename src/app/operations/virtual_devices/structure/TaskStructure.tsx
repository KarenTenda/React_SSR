import { TaskTypes, InferenceSpecificTypes} from "../types/TaskTypes";

export class TaskStructure {
    id: string;
    type: TaskTypes;
    specific_type: string;
  
    constructor(
      id: string,
      type: TaskTypes,
      specific_type: string,
    ) {
      this.id = id;
      this.type = type;
      this.specific_type = specific_type;
    }
}

