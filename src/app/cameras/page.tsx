"use client";

import useCameraService from './hooks/useCameraService';
import React, { Suspense, useRef } from 'react';
import { Container } from 'react-bootstrap';
import CameraGrid from './components/cameraGrid/CameraGrid';
// import CameraEventsService from './services/CameraEventsService';

const CamerasPage: React.FC = () => {
    const [cameras, savedCameraIDs] = useCameraService();

    return (
        <Container fluid>
            <Suspense fallback={<div>Loading camera data...</div>}>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '16px' }}>
                    <CameraGrid cameras={cameras} />
                    {/* <CameraEventsService /> */}
                </div>
            </Suspense>
        </Container>
    );
}

export default CamerasPage;
