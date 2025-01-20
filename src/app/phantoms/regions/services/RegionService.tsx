import axios from "axios";
import { RegionStructure } from "../structures/RegionStructure";

export async function RegionService(url: string): Promise<RegionStructure[]> {
    try {
        const response = await axios.get(url);
        const availableRegions = await response.data;
        return availableRegions.response_payload['regions'];
    }
    catch (error) {
        throw new Error("Error occured while fetching regions");
    }
}