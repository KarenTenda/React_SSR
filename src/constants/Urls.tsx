const FASTAPI_HOST = process.env.REACT_APP_FASTAPI_LOCAL_HOST || 'localhost';
const FASTAPI_PORT = process.env.REACT_APP_FASTAPI_PORT || '5001';
const JSON_SERVER_HOST = process.env.REACT_APP_JSON_SERVER_HOST || 'localhost';
const JSON_SERVER_PORT = process.env.REACT_APP_JSON_SERVER_PORT || '3001';


const Urls = {
    fetchPhantomCameras: `http://${FASTAPI_HOST}:${FASTAPI_PORT}/cameras`,
    fetchPhantomCamera: `http://${FASTAPI_HOST}:${FASTAPI_PORT}/cameras`,
    fetchMainWindowCamera: `http://${FASTAPI_HOST}:${FASTAPI_PORT}/ui/main_window`,
    fetchMainWindowRefresh: `http://${FASTAPI_HOST}:${FASTAPI_PORT}/application/`,
    fetchPhantomCameraCalibration: `http://${FASTAPI_HOST}:${FASTAPI_PORT}/calibration`,

    fetchRegions: `http://${FASTAPI_HOST}:${FASTAPI_PORT}/regions`,
    fetchDevices: `http://${FASTAPI_HOST}:${FASTAPI_PORT}/devices`,
    fetchPhantomModels: `http://${FASTAPI_HOST}:8080/models`,

    fetchPhantomComponents: `http://${FASTAPI_HOST}:${FASTAPI_PORT}/components`,
    fetchPhantomHomography: `http://${FASTAPI_HOST}:${FASTAPI_PORT}/homography`,

    fetchDatasets: `http://${FASTAPI_HOST}:${FASTAPI_PORT}/datasets`,
    fetchAnnotatedImages: `http://${FASTAPI_HOST}:${FASTAPI_PORT}/annotated_images`,
    fetchAnnotations: `http://${FASTAPI_HOST}:${FASTAPI_PORT}/annotations`,
    fetchImages: `http://${FASTAPI_HOST}:${FASTAPI_PORT}/images`,

    fetchPhantomYoloTrain: `http://${FASTAPI_HOST}:${FASTAPI_PORT}/yolo/train`,
    fetchPhantomYoloInference: `http://${FASTAPI_HOST}:${FASTAPI_PORT}/yolo/inference`,

    fetchJSONServer:`http://${JSON_SERVER_HOST}:${JSON_SERVER_PORT}/stepsData`
};

export default Urls;
