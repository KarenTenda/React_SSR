export interface Lens {
    lens_type: string;
    mount_type: string;
    interchangeable: boolean;
    aperture: string;
    manufacturer: string;
    model: string;
    serial_number: string;
    part_number: string;
}

export interface Source {
    source_type: string;
    source_string: string;
    exclusive: boolean;
    usb_source_type: string | null;
}

export interface RuntimeProperties {
    brightness: number | null;
    contrast: number | null;
    exposure: number;
    frame_rate: number;
    gain: number | null;
    height: number;
    hue: number | null;
    saturation: number | null;
    width: number;
    encoding: string;
}

export interface Driver {
    driver_type: string;
    image_format: string;
    initialize: {
        backend: number;
        source: Source;
        runtime: {
            properties: RuntimeProperties;
        };
    };
}

export interface Camera {
    manufacturer: string;
    model: string;
    serial_number: string;
    part_number: string;
    image_format: string;
    lens: Lens;
    camera_type: string;
    mode: string;
    driver: Driver;
}

export interface CameraSettings {
    camera: Camera;
}

export interface BackendSettings {
    id: string;
    name: string;
    enabled: boolean;
    settings: CameraSettings;
    streams: any[];  
}

export interface BackendSettingsMap {
    [key: string]: BackendSettings;
}
