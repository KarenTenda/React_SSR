import { useTranslation } from "react-i18next";

export const useLabels = () => {
    const { t } = useTranslation();

    return {
        Edit: t('Edit'),
        Delete: t('Delete'),
        Control: t('Control'),
        Save: t('Save'),
        SortBy: t('Sort By'),

        //App Pages
        Home: t('Home'),
        Homepage: t('Homepage'),
        Cameras: t('Cameras'),
        Phantoms: 'Phantoms',
        UserGuide: t('User Guide'),
        Components: t('Components'),
        Models: t('Models'),
        Regions: t('Regions'),
        RolesPermissions: t('Roles & Permissions'),
        Users: t('Users'),
        Authenication: t('Authenication'),
        Logs: t('Logs'),

        //path
        home_page: '/home_page',
        cameras_page: '/cameras_page',
        phantoms_page: '/phantoms_page',
        userguide_page: '/userguide_page',
        components_page: '/components_page',
        models_page: '/models_page',
        regions_page: '/regions_page',
        newCheckingSettings: '/newCheckingSettings',
        newInferenceSettings: '/newInferenceSettings',
        newTrackingSettings: '/newTrackingSettings',
        robot_setup_guide: '/robot-setup-guide',
        calibration_setup_guide: '/calibration-setup-guide',
        offset_adjustment_guide: '/offset-adjustment-guide',

        //CameraGrid
        Camera: t('Camera'),
        Name: t('Name'),
        Type: t('Type'),
        SearchCameras: t('Search cameras...'),

        //CameraModal
        EditCamera: t('Edit Camera'),

        //CameraSettings
        BasicDetailsTab: t('Basic Details'),
        JobsTab: t('Jobs'),
        CalibrationTab: t('Calibration'),
        StreamsTab: t('Streams'),
        AdvancedTab: t('Advanced'),
        CameraId: t('Camera ID'),
        CameraName: t('Camera Name'),
        CameraType: t('Camera Type'),
        SourceType: t('Source Type'),
        Source: t('Source'),
        Backend: t('Backend'),
        ManualFocusValue: t('Manual Focus Value'),
        ExposureTime: t('Exposure Time'),
        ExposureMode: t('Exposure Mode'),
        WhiteBalanceMode: t('White Balance Mode'),
        WhiteBalanceTemperature: t('White Balance Temperature'),
        PowerLineFrequency: t('Power Line Frequency'),
        Encoding: t('Encoding'),
        Zoom: t('Zoom'),
        Resolution: t('Resolution'),

        //ComponentGrid
        Component: t('Component'),
        SearchComponents: t('Search components...'),

        //UserGuide
        SetupGuidesTitle: t('What do you want to do?'),
        RobotSetUpTitle: t('Robot Setup guide'),
        RobotSetUpDetails: t('Step-by-step guide to setting up the robot arm for use in the system.'),
        CalibrationSetUpTitle: t('Calibration Setup guide'),
        CalibrationSetUpDetails: t('Step-by-step guide to calibrating the cameras.'),
        OffsetAdjustmentTitle: t('Offset Adjustment guide'),
        OffsetAdjustmentDetails: t('Step-by-step guide to adjusting the x and y variant offsets.'),


    };
};




