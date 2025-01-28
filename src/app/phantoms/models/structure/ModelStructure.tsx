export class ModelStructure {
    id: string;
    name: string;
    model_task: string;
    model_format: string;
    model_input_size: number[];

    constructor (id: string, name:string,  model_task: string, model_format: string, model_input_size: number[]) {
        this.id = id;
        this.name = name;
        this.model_task = model_task;
        this.model_format = model_format;
        this.model_input_size = model_input_size;
    }
}


