"use client";

import React, { Suspense, useRef } from 'react';
import { Container } from 'react-bootstrap';
import GraphGrid from './components/graphBuilder/graphGrid/GraphGrid';
import AddGraphButton from './components/AddGraphButton';

const ComponentsPage: React.FC = () => {
  return (
    <Container fluid>
      <Suspense fallback={<div>Loading camera data...</div>}>
        <div className="flex flex-col relative">
 
          <h1 className="text-4xl sticky top-0 z-[10] p-6 bg-background/50 backdrop-blur-lg flex items-center border-b justify-between">
            Workflows
            <AddGraphButton />
          </h1>
          <GraphGrid/>
        </div>
      </Suspense>
    </Container>
  );
}

export default ComponentsPage;
