export enum CameraSourceType {
    INDEX = "index",
    SERIAL = "serial",
    IP = "ip",
    PATH = "path"
}
// type CameraSourceType = 'index' | 'path' | 'serial' | 'ethernet';
type TriggerType = 'interval';
type TaskType = 'PropertyRandomizer';
type StrategyType = 'cycling';

interface RandomizationStrategy {
    strategy_type: StrategyType;
    value_list: number[];
}

interface SchedulerTrigger {
    trigger_type: TriggerType;
    trigger_details: { interval: number };
}

export interface ScheduledTask {
    camera_id: string;
    task_type: TaskType;
    scheduler_trigger: SchedulerTrigger;
    property_name: string;
    property_type: 'int'; 
    randomization_strategy: RandomizationStrategy;
}

interface Pattern {
    pattern_type: string | 'chessboard' | "circle_grid";
    cols: number;
    rows: number;
    square_size: number;
    offset_x: number;
    offset_y: number;
}

interface RefinementConfig {
    termination_criteria: [number, number, number];
    corner_subpix_criteria: [[number, number], [number, number]];
}

export interface CalibrationModel {
    pattern: Pattern;
    refinement_config: RefinementConfig;
}

interface CalibrationResult {
    camera_matrix: [],
    distortion_coefficients: [],
    rotation_vectors: [],
    translation_vectors: [],
    image_size: [number, number],
}

export interface CreateCameraCalibration {
    id: string;
    calibration_datetime: string;
    calibration_notes: string | null;
    calibration_model: CalibrationModel | null;
    images: string[];
}

export interface CameraCalibration {
    id: string,
    calibration_datetime: string,
    calibration_notes: string | null,
    calibration_model: CalibrationModel | null,
    calibration_result: CalibrationResult
}

export interface CreateCameraHomographyFromImage {
    image: string;
    detection_model: CalibrationModel | null;
}

export interface CreateCameraHomographyFromCameraID {
    camera_id: string;
    detection_model: CalibrationModel | null;
}

export interface CameraHomography {
    id: string;
    homography_datetime: string;
    homography_notes: string | null;
    homography_model: CalibrationModel | null;
    homography_result: HomographyResult
}

interface HomographyResult {
    homography_matrix: [],
}

export type CameraResolution = number[];

export class CameraStructure {
    id: string;
    type: string;
    source_type: CameraSourceType;
    source: number | string;
    name: string;
    enabled: boolean;
    resolution: CameraResolution;
    horizontal_flip?: boolean;
    vertical_flip?: boolean;
    centre_crop?: boolean;
    rotation_angle?: number;
    scheduled_tasks: ScheduledTask[] | null;
    backend: number;
    focus_mode?: string | null;
    manual_focus_value?: number | null;
    exposure_mode?: number | null;
    exposure_time?: number | null;
    white_balance_mode?: number | null;
    white_balance_temperature?: number | null;
    power_line_frequency?: number | null;
    encoding?: string | null;
    rotation_mode?: string | null;
    zoom?: number | null;
    calibration_id?: string | null;
    streams?: [] | null;

    constructor(
        id: string, type: string, source_type: CameraSourceType, source: number | string, name: string, enabled: boolean,
        resolution: CameraResolution, scheduled_tasks: ScheduledTask[], backend: number, exposure_time: number,
        horizontal_flip?: boolean, vertical_flip?: boolean, centre_crop?: boolean, rotation_angle?: number,
        focus_mode?: string, manual_focus_value?: number, exposure_mode?: number, white_balance_mode?: number,
        white_balance_temperature?: number, power_line_frequency?: number, encoding?: string, rotation_mode?: string,
        zoom?: number, calibration_id?: string, streams?: []
    ) {
        this.id = id;
        this.type = type;
        this.source_type = source_type;
        this.source = source;
        this.name = name;
        this.enabled = enabled;
        this.resolution = resolution;
        this.scheduled_tasks = scheduled_tasks;
        this.backend = backend;
        this.exposure_time = exposure_time;
        this.horizontal_flip = horizontal_flip;
        this.vertical_flip = vertical_flip;
        this.centre_crop = centre_crop;
        this.rotation_angle = rotation_angle;
        this.focus_mode = focus_mode;
        this.manual_focus_value = manual_focus_value;
        this.exposure_mode = exposure_mode;
        this.white_balance_mode = white_balance_mode;
        this.white_balance_temperature = white_balance_temperature;
        this.power_line_frequency = power_line_frequency;
        this.encoding = encoding;
        this.rotation_mode = rotation_mode;
        this.zoom = zoom;
        this.calibration_id = calibration_id;
        this.streams = streams;
    }
}
