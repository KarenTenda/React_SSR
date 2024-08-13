import axios from "axios";
import { CameraStructure } from "../structure/CameraStructure";

export async function CameraService(url: string): Promise<CameraStructure[]> {
    try {
        const response = await axios.get(url);
        const availableCameras = await response.data;
        return availableCameras.response_payload['cameras'];
    }
    catch (error) {
        throw new Error("Error occured while fetching cameras");
    }
}