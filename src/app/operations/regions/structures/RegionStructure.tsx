export enum GeometryType {
    SQUARE = 3,
    RECTANGLE = 4,
    POLYGON = 2
}

export interface Center {
    geometry_type: number;
    x: number;
    y: number;
}

export interface SquareShapeDetails {
    geometry_type: GeometryType.SQUARE;
    center: Center;
    side: number;
}

export interface RectangleShapeDetails {
    geometry_type: GeometryType.RECTANGLE;
    center: Center;
    width: number;
    height: number;
}

export interface Shape {
    shape: SquareShapeDetails | RectangleShapeDetails;
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