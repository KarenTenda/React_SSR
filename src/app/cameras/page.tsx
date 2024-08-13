"use client";

import useCameraService from './hooks/useCameraService';
import React, { Suspense, useRef } from 'react';
import { Container } from 'react-bootstrap';
import CameraGrid from './components/CameraGrid';

const CamerasPage: React.FC = () => {
    const [cameras, savedCameraIDs] = useCameraService();
    const ref = useRef<null | HTMLButtonElement>(null);

    return (
        <Container fluid>
            <Suspense fallback={<div>Loading data...</div>}>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '16px' }}>
                    <CameraGrid cameras={cameras} />
                    {/* <Button ref={ref} size='sm' variant='outline' >Click me</Button> */}
                    {/* <CameraForm /> */}
                </div>
            </Suspense>
        </Container>
    );
}

export default CamerasPage;
