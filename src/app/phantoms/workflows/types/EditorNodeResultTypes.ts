export type KeypointResult = {
    x: number;
    y: number;
    score: number;
    name: string;
};

export type classifierResult = {
    label: string;
    score: number;
};

export type ObjectDetectionResult = {
    x: number;
    y: number;
    width: number;
    height: number;
    score: number;
    class: string;
};