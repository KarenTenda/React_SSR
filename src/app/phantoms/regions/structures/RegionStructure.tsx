export interface Center {
    geometry_type: number;
    x: number;
    y: number;
}

export interface ShapeDetails {
    geometry_type: number;
    center: Center;
    side: number;
}

export interface Shape {
    shape: ShapeDetails;
}

export type Resolution = [number, number];

export class RegionStructure {
    id: string;
    type: string;
    enabled: boolean;
    reference_resolution: Resolution;
    shape: Shape;

    constructor(
        id: string,
        type: string,
        enabled: boolean,
        reference_resolution: Resolution,
        shape: Shape
    ) {
        this.id = id;
        this.type = type;
        this.enabled = enabled;
        this.reference_resolution = reference_resolution;
        this.shape = shape;
    }
}