import axios from "axios";
import { TaskStructure } from "../structure/TaskStructure";

export async function TaskService(url: string): Promise<TaskStructure[]> {
    try {
        const response = await axios.get(url);
        const availableTasks = await response.data;
        return availableTasks.response_payload['components'];
    }
    catch (error) {
        throw new Error("Error occured while fetching tasks");
    }
}